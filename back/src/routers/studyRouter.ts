import Router, { Express } from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";
import * as joi from "../validators/studyValidator";
const studyRouter: Express = Router();

studyRouter.get("/experience", studyController.experience);

studyRouter
  .get("/", passportJwt, studyController.getWords)
  .post("/", joi.validateSaveLearn, passportJwt, studyController.saveLearn);

//todo 프론트요청으로 임시 인가 제거. 추후 다 시 추가해주세요
studyRouter.get("/result", studyController.getLearnResult);
export default studyRouter;
