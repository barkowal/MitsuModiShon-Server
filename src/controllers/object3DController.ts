import { NextFunction, Response, Request } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { UploadObject3DData, UploadObject3DSchema } from "../types/Object3DTypes";
import { getPublicObjects3D, uploadObject3D } from "../services/object3DService";

export function handleUploadObject3D(req: ExtendedRequest, res: Response, next: NextFunction) {

    try {

        const objectData = parseUploadObjectRequest(req);

        uploadObject3D(objectData).then(() => {

            return res.status(200).json({
                successs: true,
                message: "Uploaded object3D successfully.",
                data: {
                }
            });

        }).catch((error) => next(error));

    } catch (error) {
        next(error);
    }

}

export function handleGetPublicObjects3D(req: Request, res: Response, next: NextFunction) {

    getPublicObjects3D().then((objects3D) => {
        return res.status(200).json({
            successs: true,
            message: "Found objects successfully.",
            data: {
                objects: objects3D
            }
        });
    }).catch((error) => { next(error); });

}

function parseUploadObjectRequest(req: ExtendedRequest): UploadObject3DData {

    if (req.userID === undefined) {
        throw new Error("User ID undefined.");
    }
    const userID: number = req.userID;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imgName: string = files["image"][0].filename;
    const dataFileName: string = files["object3D"][0].filename;

    const reqData = JSON.parse(req.body.objectData);
    const name: string = reqData.name;
    const isPublic: boolean = reqData.is_public;

    const object3DData = {
        name: name,
        is_public: isPublic,
        accountID: userID,
        imageName: imgName,
        dataFileName: dataFileName,
    };

    UploadObject3DSchema.parse(object3DData);

    return object3DData;
}
