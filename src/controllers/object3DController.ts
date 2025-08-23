import { NextFunction, Response, Request } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { UploadObject3DData, UploadObject3DSchema } from "../types/Object3DTypes";
import { getPaginatedPublicObjects3D, getPaginatedUsersObjects3D, uploadObject3D } from "../services/object3DService";
import { DefaultQueryParamsType } from "../types/UniversalTypes";
import { stringToBoolean } from "../utils/utils";

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

    try {
        const reqOptions = getRequestParameters(req);

        getPaginatedPublicObjects3D(reqOptions).then((result) => {

            return res.status(200).json({
                successs: true,
                message: "Found objects successfully.",
                data: {
                    result
                }
            });
        }).catch((error) => { next(error); });

    } catch (error) {
        next(error);
    }

}

export function handleGetPrivateObjects3D(req: ExtendedRequest, res: Response, next: NextFunction) {

    if (!req.userID) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    try {
        const reqOptions = getRequestParameters(req);

        getPaginatedUsersObjects3D(reqOptions, req.userID).then((result) => {

            return res.status(200).json({
                successs: true,
                message: "Found objects successfully.",
                data: {
                    result
                }
            });
        }).catch((error) => { next(error); });

    } catch (error) {
        next(error);
    }
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

function getRequestParameters(req: Request): DefaultQueryParamsType {
    let page = 1;
    let pageLimit = 10;
    let searchKeyword = "";
    let isPublic = undefined;
    if (req.query.page)
        page = parseInt(req.query.page as string);
    if (req.query.per_page)
        pageLimit = parseInt(req.query.per_page as string);
    if (req.query.search)
        searchKeyword = req.query.search as string;
    if (req.query.public)
        isPublic = stringToBoolean(req.query.public as string);

    if (isNaN(page) || isNaN(pageLimit)) {
        throw new Error("Invalid Query parameters!");
    }

    return { page: page, pageLimit: pageLimit, searchKeyword: searchKeyword, public: isPublic };
}
