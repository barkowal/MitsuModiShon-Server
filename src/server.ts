import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import { PORT } from "./config/env";

const app = express();

const port = PORT;

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "MitsuModiShon Rest API" });
});

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
