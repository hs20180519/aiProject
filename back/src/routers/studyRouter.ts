import express from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";
import * as joi from "../validators/studyValidator";

const studyRouter = express.Router();

studyRouter.get("/experience", studyController.experience);

studyRouter
  .get("/", joi.validateGetWords, passportJwt, studyController.getWords)
  .post("/", joi.validateSaveLearn, passportJwt, studyController.saveLearn);

studyRouter.get("/result", passportJwt, studyController.getLearnResult);
export default studyRouter;
