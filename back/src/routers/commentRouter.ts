import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as commentController from "../controllers/commentController";

const commentRouter: Express = Router();

commentRouter
  .post("/", passportJwt, commentController.createComment)
  .put("/:commentId", passportJwt, commentController.updateComment)
  .delete("/:commentId", passportJwt, commentController.deleteComment);

export default commentRouter;
