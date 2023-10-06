import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", passportJwt, userController.getProfile);

export default userRouter;
