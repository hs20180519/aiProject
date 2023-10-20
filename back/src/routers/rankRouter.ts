import { rankController } from "../controllers/rankContoller";
import Router from "express";

const RankRouter = Router();

/**유저 랭킹 저장 */
RankRouter.post("/:userId", rankController);

/**유저 랭킹 차 가져오기*/
RankRouter.get("/:userId", rankController);

/**유저 랭킹 삭제 */
RankRouter.delete("/:userID");

/**유저 랭킹 목록 */
RankRouter.get("/", rankController.getUsersRankList());

module.exports = RankRouter;
