import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import errorLogger from "./middlewares/errorLogger";
import reqAndResLogger from "./middlewares/reqAndResLogger";
import swaggerFile from "./config/swagger-output.json";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import authRouter from "./routers/authRouter";
import oAuthRouter from "./routers/oAuthRouter";
import userRouter from "./routers/userRouter";
import uploadRouter from "./routers/uploadRouter";
import postRouter from "./routers/postRouter";
import commentRouter from "./routers/commentRouter";
import studyRouter from "./routers/studyRouter";
import bookRouter from "./routers/bookRouter";
import session from "express-session";
import compression from "compression";
import helmet from "helmet";
import { local, jwt } from "./passport";
import { limiter } from "./utils/limiter";
import { startScheduler } from "./services/remindService";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

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
app.use(passport.session());

// 카카오에서 넘어오는 데이터 서버에서 쓰기 쉽게 변환해줌
passport.serializeUser(function (user: any, done) {
  console.log("serialize User");
  done(null, user);
});
passport.deserializeUser(function (user: any, done) {
  console.log("deserialize User");

  done(null, user);
});
passport.use("local", local);
passport.use("jwt", jwt);

app.use(reqAndResLogger);

app.use("/auth", authRouter);
app.use("/oauth", oAuthRouter);
app.use("/user", userRouter);
app.use("/upload", uploadRouter);
app.use("/study", studyRouter);
app.use("/book", bookRouter);

// 미사용 라우터
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.use(errorLogger);

startScheduler();

export default app;
