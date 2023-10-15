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
  .post("/word", passportJwt, bookController.createCustomWordInBook)
  .get("/word", passportJwt, bookController.getBook)
  .put("/word", passportJwt, bookController.updateCustomWordInBook)
  .delete("/word", passportJwt, bookController.deleteCustomWordInBook);

export default bookRouter;
