import * as OAuthController from "../controllers/oAuthController";
import Router, { Express } from "express";
const oAuthRouter: Express = Router();

oAuthRouter.get("/kakao", OAuthController.kakaoCallback);
oAuthRouter.post("/kakao", OAuthController.kakaoLogin);
oAuthRouter.post("/kakao/callback", OAuthController.kakaoLogin);

export default oAuthRouter;
