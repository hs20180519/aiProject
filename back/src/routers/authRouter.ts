import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";
import * as OAuthController from "../controllers/oAuthController";
import passportKakao from "../middlewares/passportKakao";

const authRouter = Router();

authRouter.get("/check", authController.checkEmailOrNickname);

authRouter.post("/register", authController.register);

authRouter.post("/verify", authController.verify);

authRouter.post("/signup", authController.createUser);

authRouter
  .post("/", passportLocal, authController.login)
  .put("/", passportJwt, authController.editUser)
  .delete("/", passportJwt, authController.deleteUser);

authRouter.get("/kakao", OAuthController.kakaoLogin);
authRouter.post("/kakao", passportKakao, authController.login);

authRouter.get("/kakao/callback", OAuthController.kakaoCallback);

function test(req: any, res: any, next: any) {
  console.log("hello hello");
}

export default authRouter;
