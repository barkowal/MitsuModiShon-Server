import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, SALT_ROUNDS } from "../config/env";
import { CreateUser, GetUserByEmail, GetUserById } from "../models/userModel";
import { LoginUserData, LoginUserSchema, RegisterUserData, RegisterUserSchema } from "../types/AuthTypes";
import { ErrorType } from "../types/ErrorType";
import { genSalt, hash, compare } from "bcrypt";
import { sign, SignOptions, verify } from "jsonwebtoken";
import { parseDuration } from "../utils/utils";
import { CreateRefreshToken, DeleteRefreshToken, FindUserRefreshTokens } from "../models/refreshTokenModel";

export async function registerUser(userData: RegisterUserData) {

    RegisterUserSchema.parse(userData);

    const existingUser = await GetUserByEmail(userData.email);

    if (existingUser) {
        const error: ErrorType = new Error("User already exists.");
        error.statusCode = 409;
        throw error;
    }

    const salt = await genSalt(SALT_ROUNDS);
    const hashedPassword = await hash(userData.password, salt);

    const createUserData: RegisterUserData = {
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
    };

    const newUser = await CreateUser(createUserData);

    const accessToken = createAccessToken(newUser.id, newUser.username);
    const refreshToken = await createRefreshToken(newUser.id, newUser.username);

    return { username: newUser.username, accessToken, refreshToken };
}

export async function loginUser(loginData: LoginUserData) {
    LoginUserSchema.parse(loginData);

    const existingUser = await GetUserByEmail(loginData.email);

    if (!existingUser) {
        const error: ErrorType = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await compare(loginData.password, existingUser.password);

    if (!isPasswordValid) {
        const error: ErrorType = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = createAccessToken(existingUser.id, existingUser.username);
    const refreshToken = await createRefreshToken(existingUser.id, existingUser.username);

    return { username: existingUser.username, accessToken, refreshToken };
}

export async function logoutUser(refreshToken: string) {
    const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (typeof decoded !== "object" || decoded === null) {
        const error: ErrorType = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    const userTokens = await FindUserRefreshTokens(decoded.userID);
    let tokenID = -1;

    for (const tokenData of userTokens) {
        const same = await compare(refreshToken, tokenData.token);
        if (same) {
            tokenID = tokenData.id;
            break;
        }
    }

    if (tokenID !== -1)
        await DeleteRefreshToken(tokenID);
}

export async function getUser(id: number) {

    const foundUser = await GetUserById(id);
    return foundUser;

}

// TODO check expired refresh tokens in db and delete it
export async function refreshAccessToken(refreshToken: string) {

    const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (typeof decoded !== "object" || decoded === null) {
        const error: ErrorType = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    const userTokens = await FindUserRefreshTokens(decoded.userID);

    let tokenExists = false;

    for (const tokenData of userTokens) {
        const same = await compare(refreshToken, tokenData.token);
        if (same) {
            tokenExists = true;
            break;
        }
    }

    if (!tokenExists) {
        const error: ErrorType = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = createAccessToken(decoded.userID, decoded.username);

    return accessToken;

}

function createAccessToken(userID: number, username: string,) {
    const token = sign({ userID: userID, username: username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
    return token;
}

async function createRefreshToken(userID: number, username: string) {
    const token = sign({ userID: userID, username: username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as SignOptions);

    const hashedToken = await hash(token, SALT_ROUNDS);

    const expirationDate = new Date(Date.now() + parseDuration(REFRESH_TOKEN_EXPIRES_IN));

    await CreateRefreshToken(userID, hashedToken, expirationDate);

    return token;
}

