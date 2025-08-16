import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { ExtendedRequest } from "../types/ExtendedRequest";

function authorizeMiddleware(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const decoded = verify(accessToken, ACCESS_TOKEN_SECRET);

        if (typeof decoded === "object" && decoded !== null) {

            req.userID = decoded.userID;
            next();

        } else {
            return res.status(401).json({ message: "Unauthorized." });
        }

    } catch (error) {
        next(error);
    }
}

export default authorizeMiddleware;
