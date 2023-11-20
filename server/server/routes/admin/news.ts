import express, {Router} from 'express';
import NewsSchema from "../../schemes/NewsSchema";
import NewsModel from '../../models/NewsModel';
import authenticateToken from "../../middleware/authMiddleware";

const newsRouter: Router = express.Router();
const newsModel: NewsModel = new NewsModel();


newsRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const postId: number = parseInt(req.params.id);
    const post: NewsSchema | undefined = newsModel.findById(postId);
    if (post) {
        return res.sendStatus(200);
    }
    res.sendStatus(404);
});

export default newsRouter;
