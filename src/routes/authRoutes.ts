
import { Router } from "express";
import { handleLoginUser, handleRegisterUser } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/register", handleRegisterUser);
authRouter.post("/login", handleLoginUser);

export default authRouter;

