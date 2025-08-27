import { Router } from "express";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import multer from "multer";
import { getFileExtension } from "../utils/utils";
import { BUCKET_BIN, OBJECT3D_DATA_PATH, OBJECT3D_IMAGE_PATH } from "../config/env";
import { handleDeleteAnimationScene, handleDownloadPublicAnimationSceneData, handleDownloadUsersAnimationSceneData, handleGetPublicAnimationScenes, handleGetUsersAnimationScenes, handlePatchAnimationScene, handleUploadAnimationScene } from "../controllers/animationSceneController";

const animationSceneRouter = Router();
const uploadObjectMiddleware = multer({

    storage: multer.diskStorage({
        destination: function(req, file, callback) {

            if (file.mimetype === "application/json") {
                callback(null, OBJECT3D_DATA_PATH);
                return;
            }

            if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
                callback(null, OBJECT3D_IMAGE_PATH);
                return;
            }

            callback(new Error("Invalid file type!"), BUCKET_BIN);
        },
        filename: function(req, file, callback) {
            callback(null, Date.now().toString() + "_file_" + file.fieldname + "." + getFileExtension(file.mimetype));
        },
    })
});

animationSceneRouter.post("/upload", authorizeMiddleware,
    uploadObjectMiddleware.fields([{ name: "scene", maxCount: 1 }, { name: "image", maxCount: 1 }]),
    handleUploadAnimationScene);
animationSceneRouter.get("/public", handleGetPublicAnimationScenes);
animationSceneRouter.get("/private", authorizeMiddleware, handleGetUsersAnimationScenes);
animationSceneRouter.get("/download/public/:id", handleDownloadPublicAnimationSceneData);
animationSceneRouter.get("/download/users/:id", authorizeMiddleware, handleDownloadUsersAnimationSceneData);

animationSceneRouter.delete("/:id", authorizeMiddleware, handleDeleteAnimationScene);
animationSceneRouter.patch("/:id", authorizeMiddleware, handlePatchAnimationScene);
export default animationSceneRouter;
