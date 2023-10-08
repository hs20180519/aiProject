import express from "express";
import * as studyController from "../controllers/studyController";
import passportJwt from "../middlewares/passportJwt";

const studyRouter = express.Router();

studyRouter.get("/", passportJwt, studyController.getWords);

export default studyRouter;
