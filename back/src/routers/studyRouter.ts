import express from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";
import { experience } from "../controllers/studyController";

const studyRouter = express.Router();

studyRouter.get("/experience", studyController.experience);

studyRouter.get("/", passportJwt, studyController.getWords);

studyRouter.post("/", passportJwt, studyController.saveLearn);

studyRouter.get("/result", passportJwt, studyController.getLearnResult);
export default studyRouter;
