import multer from "multer";
import path from "path";
import {__publicDir} from "../config";

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, path.resolve(__publicDir, 'images'));
    },
    filename(_, file, cb) {
        const name = (new Date().toUTCString() + file.originalname).replace(' ', '');
        cb(null, name);
    }
});


const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

export const multerMiddleware = multer({
    storage: storage,
    fileFilter(_, file, cb) {
        cb(null, acceptedTypes.includes(file.mimetype));
    }
})