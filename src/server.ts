import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import object3DRouter from "./routes/object3DRoutes";
import { FULL_REQUEST_PATH } from "./utils/global";
import imageRouter from "./routes/imageRoutes";
import sceneRouter from "./routes/sceneRoutes";

const app = express();

const port = PORT;

const corsOptions = {
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(FULL_REQUEST_PATH + "/auth", authRouter);
app.use(FULL_REQUEST_PATH + "/objects3D", object3DRouter);
app.use(FULL_REQUEST_PATH + "/scene", sceneRouter);
app.use(FULL_REQUEST_PATH + "/image", imageRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "MitsuModiShon Rest API" });
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
