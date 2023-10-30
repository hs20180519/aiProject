import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as storageController from "../controllers/storageController";

const storageRouter: Express = Router();

storageRouter.get("/", passportJwt, storageController.getAllWords);

storageRouter.get("/search", passportJwt, storageController.searchWords);

export default storageRouter;
