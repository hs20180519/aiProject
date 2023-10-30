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
import studyRouter from "./routers/studyRouter";
import bookRouter from "./routers/bookRouter";
import progressRouter from "./routers/progressRouter";
import rankRouter from "./routers/rankRouter";
import storageRouter from "./routers/storageRouter";
import session from "express-session";
import compression from "compression";
import helmet from "helmet";
import { limiter } from "./config/limiter";
import { local, jwt } from "./passport";
import { startScheduler } from "./services/remindService";

const app: express.Application = express();

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
});

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public"), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
app.use(
  session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: any, done): void {
  console.log("serialize User");
  done(null, user);
});
passport.deserializeUser(function (user: any, done): void {
  console.log("deserialize User");
  done(null, user);
});
passport.use("local", local);
passport.use("jwt", jwt);

app.use(reqAndResLogger);

app.use("/api/auth", authRouter);
app.use("/api/oauth", oAuthRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/study", studyRouter);
app.use("/api/book", bookRouter);
app.use("/api/progress", progressRouter);
app.use("/api/rank", rankRouter);
app.use("/api/storage", storageRouter);

app.use(errorLogger);

startScheduler();

export default app;
