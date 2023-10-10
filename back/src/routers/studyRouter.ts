import express from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";

const studyRouter = express.Router();

studyRouter.get("/", passportJwt, studyController.getWords);

studyRouter.post("/", passportJwt, studyController.saveLearn);

studyRouter.get("/result", passportJwt, studyController.getLearnResult);
export default studyRouter;
