import Router from "express";
import passportLocal from "../middlewares/passportLocal";
import passportJwt from "../middlewares/passportJwt";
import * as authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", authController.createUser);

authRouter.post("/login", passportLocal, authController.login);

authRouter.get("/profile", passportJwt, authController.getProfile);

authRouter.put("/edit", passportJwt, authController.editUser);

export default authRouter;
