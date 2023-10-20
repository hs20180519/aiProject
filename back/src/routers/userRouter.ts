import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as userController from "../controllers/userController";

const userRouter: Express = Router();

userRouter.get("/", passportJwt, userController.getProfile);

export default userRouter;
