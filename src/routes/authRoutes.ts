
import { Router } from "express";
import { handleGetUser, handleLoginUser, handleLogoutUser, handleRefreshToken, handleRegisterUser } from "../controllers/authController";
import authorizeMiddleware from "../middlewares/authorizeMiddleware";

const authRouter = Router();

authRouter.post("/register", handleRegisterUser);
authRouter.post("/login", handleLoginUser);
authRouter.delete("/refresh/logout", handleLogoutUser);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/:id", authorizeMiddleware, handleGetUser);

export default authRouter;

