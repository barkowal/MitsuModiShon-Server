import { Router } from "express";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";
import { handleDownloadUsersObject3D, handleDownloadPublicObject3D, handleGetPrivateObjects3D, handleGetPublicObjects3D, handleUploadObject3D, handleDeleteObject3D, handlePatchObject3D } from "../controllers/object3DController";
import multer from "multer";
import { getFileExtension } from "../utils/utils";
import { BUCKET_BIN, OBJECT3D_DATA_PATH, OBJECT3D_IMAGE_PATH } from "../config/env";
import fs from "fs";

const object3DRouter = Router();
const uploadObjectMiddleware = multer({

    storage: multer.diskStorage({
        destination: function(req, file, callback) {

            if (!fs.existsSync(OBJECT3D_DATA_PATH)) {
                fs.mkdirSync(OBJECT3D_DATA_PATH, { recursive: true });
            }

            if (!fs.existsSync(OBJECT3D_IMAGE_PATH)) {
                fs.mkdirSync(OBJECT3D_IMAGE_PATH, { recursive: true });
            }

            if (!fs.existsSync(BUCKET_BIN)) {
                fs.mkdirSync(BUCKET_BIN, { recursive: true });
            }

            if (file.mimetype === "application/json") {
                callback(null, OBJECT3D_DATA_PATH);
                return;
            }

            if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
                callback(null, OBJECT3D_IMAGE_PATH);
                return;
            }

            const err = new Error("Invalid file type!");
            err.name = "FileTypeErr";

            callback(err, BUCKET_BIN);
        },
        filename: function(req, file, callback) {
            callback(null, Date.now().toString() + "_file_" + file.fieldname + "." + getFileExtension(file.mimetype));
        },
    })
});

object3DRouter.post("/upload", authorizeMiddleware,
    uploadObjectMiddleware.fields([{ name: "object3D", maxCount: 1 }, { name: "image", maxCount: 1 }]),
    handleUploadObject3D);

object3DRouter.get("/public", handleGetPublicObjects3D);
object3DRouter.get("/private", authorizeMiddleware, handleGetPrivateObjects3D);
object3DRouter.get("/download/public/:id", handleDownloadPublicObject3D);
object3DRouter.get("/download/users/:id", authorizeMiddleware, handleDownloadUsersObject3D);

object3DRouter.delete("/:id", authorizeMiddleware, handleDeleteObject3D);
object3DRouter.patch("/:id", authorizeMiddleware, handlePatchObject3D);

export default object3DRouter;
