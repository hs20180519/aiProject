import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as postController from "../controllers/postController";

const postRouter = Router();

postRouter
  .post("/", passportJwt, postController.createPost)
  .get("/", postController.getPosts)
  .put("/:postId", passportJwt, postController.updatePost)
  .delete("/:postId", passportJwt, postController.deletePost);

export default postRouter;
