import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as commentController from "../controllers/commentController";

const commentRouter = Router();

commentRouter
  .post("/", passportJwt, commentController.createComment)
  .put("/:commentId", passportJwt, commentController.updateComment)
  .delete("/:commentId", passportJwt, commentController.deleteComment);

export default commentRouter;
