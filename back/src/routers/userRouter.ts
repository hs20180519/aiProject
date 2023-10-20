import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as userController from "../controllers/userController";
import { rankController } from "../controllers/rankContoller";

const userRouter: Express = Router();

userRouter.get("/", passportJwt, userController.getProfile);

// 유저 랭킹 차 정보를 가져오는 엔드포인트
userRouter.get("/rankingChange/:userId", passportJwt, rankController);

export default userRouter;
