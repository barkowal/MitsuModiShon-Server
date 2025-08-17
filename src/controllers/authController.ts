import { Request, Response, NextFunction } from "express";
import { getUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/authService";
import { ErrorType } from "../types/ErrorType";
import { parseDuration } from "../utils/utils";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../config/env";

export function handleLoginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    loginUser({ email, password }).then(

        ({ username, accessToken, refreshToken }) => {

            const message = "User signed in succesfully";
            sendSuccessAuthResponse(res, username, accessToken, refreshToken, message);

        }

    ).catch((error) => {
        next(error);
    });

}

export function handleRegisterUser(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;

    registerUser({ username, email, password }).then(

        ({ username, accessToken, refreshToken }) => {

            const message = "User created succesfully";
            sendSuccessAuthResponse(res, username, accessToken, refreshToken, message);

        }

    ).catch((error) => {
        next(error);
    });
}

export function handleLogoutUser(req: Request, res: Response, next: NextFunction) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    logoutUser(refreshToken).then(
        () => {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            return res.status(200).json({
                successs: true,
                message: "Logged out successfully.",
                data: {
                }
            });

        }
    ).catch((error) => {
        next(error);
    });

}

export function handleRefreshToken(req: Request, res: Response, next: NextFunction) {


    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    refreshAccessToken(refreshToken).then(

        (accessToken) => {

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: parseDuration(ACCESS_TOKEN_EXPIRES_IN),
            });

            return res.status(201).json({
                successs: true,
                message: "Successfully created new access token.",
                data: {
                }
            });
        }

    ).catch((error) => {
        next(error);
    });

}

export function handleGetUser(req: Request, res: Response, next: NextFunction) {

    const id = Number(req.params.id);
    if (isNaN(id)) {
        const error: ErrorType = new Error("Invalid params!");
        error.statusCode = 404;
        next(error);
    }

    getUser(id).then(
        (user) => {
            res.status(201).json({
                successs: true,
                message: "User successfully found.",
                data: {
                    user: user,
                }
            });
        }
    ).catch((error) => {
        next(error);
    });

}

function sendSuccessAuthResponse(res: Response, username: string, accessToken: string, refreshToken: string, message: string) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: parseDuration(REFRESH_TOKEN_EXPIRES_IN),
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: parseDuration(ACCESS_TOKEN_EXPIRES_IN),
    });

    res.status(201).json({
        successs: true,
        message: message,
        data: {
            username: username,
        }
    });
}
