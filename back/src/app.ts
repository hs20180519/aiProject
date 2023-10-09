import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import errorLogger from "./middlewares/errorLogger";
import reqAndResLogger from "./middlewares/reqAndResLogger";
import swaggerFile from "./config/swagger-output.json";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import { local, jwt, kakao } from "./passport";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/userRouter";
import uploadRouter from "./routers/uploadRouter";
import postRouter from "./routers/postRouter";
import commentRouter from "./routers/commentRouter";
import studyRouter from "./routers/studyRouter";
import session from "express-session";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
app.use(
  session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    },
  }),
);
app.use(passport.initialize());
passport.use("local", local);
passport.use("jwt", jwt);
passport.use("kakao", kakao);

app.use(reqAndResLogger);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/upload", uploadRouter);
app.use("/study", studyRouter);

// 미사용 라우터
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.use(errorLogger);

export default app;
