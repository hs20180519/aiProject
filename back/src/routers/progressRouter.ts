import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import { getProgress } from "../controllers/progressController";
import * as progressController from "../controllers/progressController";
const progressRouter: Express = Router();

progressRouter.get("/", passportJwt, progressController.getProgress);

export default progressRouter;
