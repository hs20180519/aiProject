import Router from "express";
import * as levelController from "../controllers/levelController";
const levelRouter = Router();

levelRouter.get("/", levelController.getTestWords);

export default levelRouter;
