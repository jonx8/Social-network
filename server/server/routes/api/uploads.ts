import express, {Router} from "express";
import {multerMiddleware} from "../../middleware/multerMiddleware";

const fileUploadRouter: Router = Router();

fileUploadRouter.post('/avatar', multerMiddleware.single('avatar'),
    function (req: express.Request, res: express.Response) {
        if (req.file) {
            return res.status(201).json(`/public/images/${req.file.filename}`);
        }
        return res.status(400).json('Invalid file format');
    }
);

export default fileUploadRouter;