import * as OAuthController from "../controllers/oAuthController";
import Router from "express";
const oAuthRouter = Router();

oAuthRouter.get("/kakao", OAuthController.kakaoCallback);
oAuthRouter.post("/kakao", OAuthController.kakaoLogin);
oAuthRouter.post("/kakao/callback", OAuthController.kakaoLogin);

export default oAuthRouter;
