import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { AnimationSceneQueryParamsType, UploadAnimationSceneData, UploadAnimationSceneSchema } from "../types/AnimationSceneTypes";
import { deleteAnimationScene, getPaginatedPublicAnimationScenes, getPaginatedUsersAnimationScenes, getPublicAnimationSceneDataFile, getUsersAnimationSceneDataFile, patchAnimationScene, uploadAnimationScene } from "../services/animationSceneService";
import { stringToBoolean } from "../utils/utils";
import { OBJECT3D_DATA_PATH } from "../config/env";

export function handleUploadAnimationScene(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {

        const sceneData = parseUploadSceneRequest(req);

        uploadAnimationScene(sceneData).then(() => {

            return res.status(200).json({
                success: true,
                message: "Uploaded animation scene successfully.",
                data: {
                }
            });

        }).catch((error) => next(error));

    } catch (error) {
        next(error);
    }

}

export function handleGetPublicAnimationScenes(req: ExtendedRequest, res: Response, next: NextFunction) {

    try {
        const reqOptions = getSceneRequestParameters(req);
        getPaginatedPublicAnimationScenes(reqOptions).then((result) => {

            return res.status(200).json({
                success: true,
                message: "Found animation scenes successfully.",
                data: {
                    result
                }
            });
        }).catch((error) => { next(error); });

    } catch (error) {
        next(error);
    }
}

export function handleGetUsersAnimationScenes(req: ExtendedRequest, res: Response, next: NextFunction) {

    if (!req.userID) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    try {
        const reqOptions = getSceneRequestParameters(req);

        getPaginatedUsersAnimationScenes(reqOptions, req.userID).then((result) => {

            return res.status(200).json({
                success: true,
                message: "Found animation scenes successfully.",
                data: {
                    result
                }
            });
        }).catch((error) => { next(error); });

    } catch (error) {
        next(error);
    }
}

export function handleDownloadPublicAnimationSceneData(req: Request, res: Response, next: NextFunction) {

    try {
        const objectID = parseInt(req.params.id);

        if (objectID === undefined) {
            return res.status(404).json({ message: "Wrong request parameters." });
        }

        getPublicAnimationSceneDataFile(objectID).then((sceneDataFile) => {

            if (sceneDataFile === null) {
                return res.status(404).json({ message: "No such object." });
            }

            const scenePath = OBJECT3D_DATA_PATH + "/" + sceneDataFile.data_filename;
            res.sendFile(scenePath, { root: (__dirname + "../../../") });

        }).catch(error => {
            next(error);
        });

    } catch (error) {
        next(error);
    }
}

export function handleDownloadUsersAnimationSceneData(req: ExtendedRequest, res: Response, next: NextFunction) {

    try {
        const objectID = parseInt(req.params.id);

        if (objectID === undefined) {
            return res.status(404).json({ message: "Wrong request parameters." });
        }
        if (req.userID === undefined) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        getUsersAnimationSceneDataFile(objectID, req.userID).then((sceneDataFile) => {

            if (sceneDataFile === null) {
                return res.status(404).json({ message: "No such object." });
            }

            const scenePath = OBJECT3D_DATA_PATH + "/" + sceneDataFile.data_filename;
            res.sendFile(scenePath, { root: (__dirname + "../../../") });

        }).catch(error => {
            next(error);
        });

    } catch (error) {
        next(error);
    }
}

export function handleDeleteAnimationScene(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const sceneID = parseInt(req.params.id);

        if (sceneID === undefined) {
            return res.status(404).json({ message: "Wrong request parameters." });
        }
        if (req.userID === undefined) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        deleteAnimationScene(sceneID, req.userID).then((response) => {

            if (response === null) {
                return res.status(404).json({ message: "No such object." });
            }

            return res.status(200).json({ success: true, message: "Deleted successfully." });

        }).catch(error => {
            next(error);
        });

    } catch (error) {
        next(error);
    }
}

export function handlePatchAnimationScene(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
        const sceneID = parseInt(req.params.id);

        if (sceneID === undefined) {
            return res.status(404).json({ message: "Wrong request parameters." });
        }
        if (req.userID === undefined) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const { name, isPublic } = req.body;

        patchAnimationScene({ name: name, is_public: isPublic }, sceneID, req.userID).then((response) => {

            if (response === null) {
                return res.status(404).json({ message: "No such object." });
            }

            return res.status(200).json({ success: true, message: "Updated successfully." });

        }).catch(error => {
            next(error);
        });

    } catch (error) {
        next(error);
    }
}

function parseUploadSceneRequest(req: ExtendedRequest): UploadAnimationSceneData {

    if (req.userID === undefined) {
        throw new Error("User ID undefined.");
    }
    const userID: number = req.userID;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imgName: string = files["image"][0].filename;
    const dataFileName: string = files["scene"][0].filename;

    const reqData = JSON.parse(req.body.sceneData);
    const name: string = reqData.name;
    const duration: number = parseInt(reqData.duration);
    const isPublic: boolean = reqData.is_public;

    const sceneData = {
        name: name,
        imageName: imgName,
        dataFileName: dataFileName,
        duration: duration,
        is_public: isPublic,
        accountID: userID,
    };

    UploadAnimationSceneSchema.parse(sceneData);

    return sceneData;
}


function getSceneRequestParameters(req: Request): AnimationSceneQueryParamsType {
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

    return { page: page, pageLimit: pageLimit, searchKeyword: searchKeyword, public: isPublic, };
}
