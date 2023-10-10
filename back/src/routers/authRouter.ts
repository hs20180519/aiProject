import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";
import passport from "passport";

const authRouter = Router();

authRouter.get("/check", authController.checkEmailOrNickname);

authRouter.post("/register", authController.register);

authRouter.post("/verify", authController.verify);

authRouter.post("/signup", authController.createUser);

authRouter.post("/", passportLocal, authController.login);

authRouter.put("/", passportJwt, authController.editUser);

authRouter.delete("/", passportJwt, authController.deleteUser);

authRouter.get(
  "/kakao",
  passport.authenticate("kakao", { failureRedirect: "/?error=카카오로그인 실패" }),
  (req, res) => {
    res.redirect("/");
  },
);

export default authRouter;
