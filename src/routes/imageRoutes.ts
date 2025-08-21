import { Router } from "express";
import { handleGetImage } from "../controllers/imageController";

const imageRouter = Router();

imageRouter.get("/:image_filename", handleGetImage);

export default imageRouter;
