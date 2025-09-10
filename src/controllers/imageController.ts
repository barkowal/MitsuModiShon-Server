import { NextFunction, Request, Response } from "express";
import { IMAGE_URL_SECRET, OBJECT3D_IMAGE_PATH } from "../config/env";
import { verify } from "jsonwebtoken";

export function handleGetImage(req: Request, res: Response, next: NextFunction) {
    try {
        const image = req.params.image_filename;

        if (image === undefined) {
            return res.status(404).json({ message: "Wrong image parameters" });
        }

        verifyImageRequest(req);

        const imagePath = OBJECT3D_IMAGE_PATH + "/" + image;

        res.sendFile(imagePath, { root: (__dirname + "../../../") });

    } catch (error) {
        next(error);
    }
}

function verifyImageRequest(req: Request) {
    const signature = req.query.signature as string;

    if (signature === undefined) {
        const err = new Error("You cannot access this image!");
        err.name = "NoImageSignature";
        throw err;
    }

    const decoded = verify(signature, IMAGE_URL_SECRET);

    if (typeof decoded !== "object" && decoded === null){
        const err = new Error("You cannot access this image!");
        err.name = "ErrorImageVerify";
        throw err;
    }

}
