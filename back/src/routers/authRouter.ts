import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";
import * as joi from "../validators/userValidator";
import { checkEmail } from "../controllers/authController";
import { validateCheckEmail } from "../validators/userValidator";

const authRouter = Router();

authRouter.get("/check", joi.validateCheckEmail, authController.checkEmail);

authRouter.post("/register", joi.validateRegister, authController.register);

authRouter.post("/verify", joi.validateVerify, authController.verify);

authRouter.post("/signup", joi.validateCreateUser, authController.createUser);

authRouter
  .post("/", joi.validateLogin, passportLocal, authController.login)
  .put("/", joi.validateEditUser, passportJwt, authController.editUser)
  .delete("/", passportJwt, authController.deleteUser);

export default authRouter;
