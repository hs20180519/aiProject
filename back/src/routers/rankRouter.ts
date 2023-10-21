import { rankController } from "../controllers/rankContoller";
import Router from "express";

const RankRouter = Router();

/**유저 랭킹 저장 */
RankRouter.post("/:userId", rankController);

// todo 이게 있으면 userRouter 의 랭킹 변동 조회 api는 필요없지 않을까요?
/**유저 랭킹 차 가져오기*/
RankRouter.get("/:userId", rankController);

// todo 유저 개인이 본인 랭킹을 지울 수 있게 하는건 좀 이상하지 않..?
/**유저 랭킹 삭제 */
RankRouter.delete("/:userID");

/**유저 랭킹 목록 */
RankRouter.get("/", rankController.getUsersRankList());

module.exports = RankRouter;
