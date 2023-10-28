import * as rankController from "../controllers/rankContoller";
import Router from "express";

//todo 지금 모든 경로들이 미완성상태라 여기저기에서 에러가 발생하는데 이러면 어디에서 무슨 에러가 발생하는지 파악하기 어렵지 않을까요?
// 진행하실 때 해당 기능에 대한 스토리와 시퀀스를 그려보고 하나하나 완성해나가는게 더 좋을거같아요
// -> 학습자들에게 랭킹을 보여주면 좋겠네? -> 일단 전체 랭킹을 보여줘야겠네? (전체유저 랭킹 조회 API)
// -> 학습자 개인의 랭킹도 추적할 수 있어야겠지? -> 개인 랭킹 조회
// -> 랭킹변동을 알려줘야겠네? 어느시점에 저장하고 어느 시점에 알려주고, 어던 방식으로 알려줘야할까? -> ...

// 라우터 변수는 생성자가 아니라 소문자로 변경했습니다
const rankRouter = Router();

/**유저 랭킹 목록 */
rankRouter.get("/", rankController.getUsersRankList);

/** 로그인한 유저의 랭킹 */
// 접근못함
rankRouter.get("/:userId", rankController.getUserRank);

/**유저 랭킹 차 가져오기*/
rankRouter.get("/gap/:userId", rankController.getUserGapRank);

export default rankRouter;
