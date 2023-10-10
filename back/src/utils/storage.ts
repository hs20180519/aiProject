import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ParamsDictionary } from "express-serve-static-core";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/images"),
  filename: (req, file: Express.Multer.File, callback): void => {
    const imageFormat = file.mimetype.split("/")[1];
    const filename = `img_${uuidv4()}.${imageFormat}`;
    callback(null, filename);
  },
});

export default storage;
