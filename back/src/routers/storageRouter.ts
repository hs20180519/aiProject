import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as storageController from "../controllers/storageController";

const storageRouter: Express = Router();

storageRouter.get("/", passportJwt, storageController.getAllWords);

export default storageRouter;
