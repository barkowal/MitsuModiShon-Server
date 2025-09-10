import { Request, Response, NextFunction } from "express";
import { ErrorType } from "../types/ErrorType";

function errorMiddleware(err: ErrorType, req: Request, res: Response, next: NextFunction) {
    try {

        let error: ErrorType = {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
        };

        if (error.name === "ZodError") {
            const message = "Invalid data.";
            error = new Error(message);
            error.statusCode = 422;
        }

        if (err.name === "TypeError") {
            console.warn(error.message);
            const message = "The request body is not valid.";
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.code === "ENOENT") {
            console.warn(err.message);
            const message = "No such file.";
            error = new Error(message);
            error.statusCode = 404;
        }

        // multer uplaod file type error
        if(err.name === "FileTypeErr"){
            console.warn(err.message);
            const message = "Invalid file type!";
            error = new Error(message);
            error.statusCode = 400;
        }

        if(err.name === "NoImageSignature"){
            console.warn(err.message);
            error = new Error(err.message);
            error.statusCode = 400;
        }

        if(err.name === "ErrorImageVerify"){
            console.warn(err.message);
            error = new Error(err.message);
            error.statusCode = 400;
        }

        // Prisma no record found
        if (err.code === "P2025") {
            console.warn(err.message);
            const message = "Couldn't find object.";
            error = new Error(message);
            error.statusCode = 404;
        }

        res.status(error.statusCode || 500).json({ success: false, error: error.message || "Server Error :(" });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;
