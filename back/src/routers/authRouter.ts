import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";
import * as joi from "../validators/userValidator";
import * as OAuthController from "../controllers/oAuthController";
import passportKakao from "../middlewares/passportKakao";


const authRouter = Router();

authRouter.get("/check", joi.validateCheckEmailOrNickname, authController.checkEmailOrNickname);

authRouter.post("/register", joi.validateRegister, authController.register);

authRouter.post("/verify", joi.validateVerify, authController.verify);

authRouter.post("/signup", joi.validateCreateUser, authController.createUser);

authRouter
  .post("/", joi.validateLogin, passportLocal, authController.login)
  .put("/", joi.validateEditUser, passportJwt, authController.editUser)
  .delete("/", passportJwt, authController.deleteUser);

authRouter.get("/kakao", OAuthController.kakaoLogin);
authRouter.post("/kakao", passportKakao, authController.login);

authRouter.get("/kakao/callback", OAuthController.kakaoCallback);


export default authRouter;
