import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "../services/authService";

export function handleLoginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    loginUser({ email, password }).then(

        ({ username, token }) => {
            res.status(201).json({
                successs: true,
                message: "User signed in succesfully",
                data: {
                    username: username,
                    token: token,
                }
            });
        }

    ).catch((error) => {
        next(error);
    });

}

export function handleRegisterUser(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;

    registerUser({ username, email, password }).then(

        (userToken) => {
            res.status(201).json({
                successs: true,
                message: "User created succesfully",
                data: {
                    token: userToken,
                }
            });
        }

    ).catch((error) => {
        next(error);
    });

}
