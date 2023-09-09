import Router from "express";
import passportJwt from "../middlewares/passportJwt";
import multer from "multer";
import storage from "../utils/storage";
import * as uploadController from "../controllers/uploadController";

const upload = multer({ storage });
const uploadRouter = Router();

uploadRouter.post(
    "/profile-image",
    passportJwt,
    upload.single("profileImage"),
    uploadController.uploadProfileImage,
);

export default uploadRouter;
