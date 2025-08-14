import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
import { CreateUser, GetUserByEmail } from "../models/userModel";
import { LoginUserData, LoginUserSchema, RegisterUserData, RegisterUserSchema } from "../types/AuthTypes";
import { ErrorType } from "../types/ErrorType";
import { genSalt, hash, compare } from "bcrypt";
import { sign, SignOptions } from "jsonwebtoken";

export async function registerUser(userData: RegisterUserData) {

    RegisterUserSchema.parse(userData);

    const existingUser = await GetUserByEmail(userData.email);

    if (existingUser) {
        const error: ErrorType = new Error("User already exists.");
        error.statusCode = 409;
        throw error;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(userData.password, salt);

    const createUserData: RegisterUserData = {
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
    };

    const newUser = await CreateUser(createUserData);

    const token = sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    return token;
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

    const token = sign({ userId: existingUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    return { username: existingUser.username, token: token };
}
