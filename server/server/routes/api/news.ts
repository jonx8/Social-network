import express, {Router} from "express";
import NewsModel from "../../models/NewsModel";
import NewsSchema from "../../schemes/NewsSchema";
import NotFoundError from "../../errors/NotFoundError";

const newsModel: NewsModel = new NewsModel();
const newsAPIRouter: Router = express.Router();

newsAPIRouter.get('/:id([0-9]{1,})',
    function (req: express.Request, res: express.Response): express.Response {
        const postId: number = parseInt(req.params.id);
        const post: NewsSchema | undefined = newsModel.findById(postId);
        if (post) {
            return res.status(200).json(post);
        }
        return res.sendStatus(404);
    }
);

newsAPIRouter.get('/', (req: express.Request, res: express.Response) => {
    const id = parseInt(<string>req.query['userId']);
    res.status(200).json(newsModel.all().filter(post => post.authorId === id))
})

newsAPIRouter.post('/', (req: express.Request, res: express.Response) => {
    const post: NewsSchema = {...req.body};
    try {
        const newPost: NewsSchema = newsModel.create(post);
        res.status(201).json(newPost);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

newsAPIRouter.delete('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const postId: number = parseInt(req.params.id);
    try {
        newsModel.delete(postId);
        return res.sendStatus(204);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }

})

export default newsAPIRouter;