import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/image"),
  filename: (req, file: Express.Multer.File, callback): void => {
    const imageFormat: string = file.mimetype.split("/")[1];
    const filename: string = `img_${uuidv4()}.${imageFormat}`;
    callback(null, filename);
  },
});

export default storage;
