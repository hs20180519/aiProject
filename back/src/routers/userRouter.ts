import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as userController from "../controllers/userController";
import { rankController } from "../controllers/rankContoller";

const userRouter: Express = Router();

userRouter.get("/", passportJwt, userController.getProfile);

// todo 이미 rank api에 동일한 기능을 하는 경로가있는데 굳이 초입을 분리할 필요가 있을까요?

// 유저 랭킹 차 정보를 가져오는 엔드포인트
userRouter.get("/rankingChange/:userId", passportJwt, rankController);

export default userRouter;
