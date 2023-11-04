import * as rankController from "../controllers/rankContoller";
import passportJwt from "../middlewares/passportJwt";
import Router from "express";

const rankRouter = Router();

/**유저 랭킹 목록 */
rankRouter.get("/", rankController.getUsersRankList);

/** 로그인한 유저의 랭킹 */
rankRouter.get("/userRank", passportJwt, rankController.getUserRank);

/**유저 랭킹 차 가져오기*/
rankRouter.get("/rankGap", passportJwt, rankController.getRankGap);

export default rankRouter;
