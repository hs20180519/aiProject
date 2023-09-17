import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import errorLogger from "./middlewares/errorLogger";
import responseLogger from "./middlewares/responseLogger";
import swaggerFile from "./config/swagger-output.json";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { local, jwt, kakao } from "./passport";
import authRouter from "./routers/authRouter";
import uploadRouter from "./routers/uploadRouter";
import postRouter from "./routers/postRouter";
import commentRouter from "./routers/commentRouter";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerFile, { explorer: true }),
);

app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
passport.use("kakao", kakao);

app.use(responseLogger);

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.use(errorLogger);

export default app;
