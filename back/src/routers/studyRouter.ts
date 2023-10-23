import Router, { Express } from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";
import * as joi from "../validators/studyValidator";
const studyRouter: Express = Router();

studyRouter.get("/experience", studyController.experience);

studyRouter
  .get("/", passportJwt, studyController.getWords)
  .post("/", joi.validateSaveLearn, passportJwt, studyController.saveLearn);

studyRouter.get("/result", passportJwt, studyController.getLearnResult);
export default studyRouter;
