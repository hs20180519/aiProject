import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import * as bookController from "../controllers/bookController";

const bookRouter = Router();

bookRouter
  .post("/", passportJwt, bookController.createBook)
  .get("/", passportJwt, bookController.getBookList)
  .put("/", passportJwt, bookController.updateCustomBook)
  .delete("/", passportJwt, bookController.deleteCustomBook);

bookRouter
  .post("/word", passportJwt, bookController.createCustomBookInWord)
  .get("/word", passportJwt, bookController.getBook)
  .put("/word", passportJwt, bookController.updateCustomBookInWord)
  .delete("/word", passportJwt, bookController.deleteCustomBookInWord);

export default bookRouter;
