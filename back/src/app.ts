import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import errorMiddleware from "./middlewares/errorMiddleware";
import resLogingMiddleware from "./middlewares/resLogingMiddleware";
import swaggerFile from "./config/swagger-output.json";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { local, jwt, kakao } from "./passport";
import authRouter from "./routers/authRouter";

const app = express();

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
app.use(resLogingMiddleware);
app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
passport.use("kakao", kakao);

app.use("/auth", authRouter);
// app.use(postRouter);
// app.use(commentRouter);
app.use(errorMiddleware);

export default app;
