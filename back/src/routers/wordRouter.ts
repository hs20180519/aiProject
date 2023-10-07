import express from "express";
import * as wordController from "../controllers/wordController";
import passportJwt from "../middlewares/passportJwt";

const wordRouter = express.Router();

wordRouter.get("/", passportJwt, wordController.getWords);

export default wordRouter;
