import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as bookController from "../controllers/bookController";
import { getBookList } from "../controllers/bookController";

const bookRouter = Router();

bookRouter.post("/", passportJwt, bookController.createBook);

bookRouter.get("/", passportJwt, bookController.getBookList);

bookRouter.get("/word", passportJwt, bookController.getBook);

export default bookRouter;
