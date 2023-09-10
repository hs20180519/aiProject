import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as postController from "../controllers/postController";

const postRouter = Router();

postRouter.post("/", passportJwt, postController.createPost);

postRouter.get("/", postController.getPosts);

export default postRouter;
