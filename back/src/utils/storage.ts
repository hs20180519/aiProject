import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public/images"),
    filename: (req, file, callback) => {
        const imageFormat = file.mimetype.split("/")[1];
        let filename = `img_${uuidv4()}.${imageFormat}`;
        callback(null, filename);
    },
});

export default storage;
