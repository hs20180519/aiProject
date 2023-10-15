import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";
import passport from "passport";
import * as joi from "../validators/userValidator";

const authRouter = Router();

authRouter.get("/check", joi.validateCheckEmailOrNickname, authController.checkEmailOrNickname);

authRouter.post("/register", joi.validateRegister, authController.register);

authRouter.post("/verify", joi.validateVerify, authController.verify);

authRouter.post("/signup", joi.validateCreateUser, authController.createUser);

authRouter
  .post("/", joi.validateLogin, passportLocal, authController.login)
  .put("/", joi.validateEditUser, passportJwt, authController.editUser)
  .delete("/", passportJwt, authController.deleteUser);

authRouter.get("/kakao", authController.oAuthKakaLogin);

authRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/?error=카카오로그인 실패" }),
  (req, res) => {
    res.redirect("/");
    // 유저 나옴 -> 로그인 됨
    // 소셜 로그인일 경우 카카오톡 전용 passport를 만들어야할 듯? -> 임시 비밀번호를 유저에게 발급 후 따로 내 정보에서 변경하도록 하게 함(?)
    // 토큰 발급 -> 이메일이 왜 없지?
    // sns전용 access_token 발급받는 로직을 따로 만들어 줘야함(?)

    /* 닉네임 없을 경우 등록 페이지로 이동되게..?
    if(req.user && 'nickname' in req.user){
      if(!req.user.nickname){
      res.redirect("/settings/nickname");
      }
      else{
      res.redirect("/");
      }

    }
   else {
      res.redirect("/settings/nickname");
  } */
  },
);

export default authRouter;
