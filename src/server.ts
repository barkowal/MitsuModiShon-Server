import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import object3DRouter from "./routes/object3DRoutes";

const app = express();

const port = PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/objects3D", object3DRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "MitsuModiShon Rest API" });
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
