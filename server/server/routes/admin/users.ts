import express, {Router} from "express";
import UserModel from "../../models/UserModel";
import UserSchema from "../../schemes/UserSchema";
import authenticateToken from "../../middleware/authMiddleware";

const usersRouter: Router = express.Router();
const userModel: UserModel = new UserModel()

usersRouter.get('/', (_: express.Request, res: express.Response) => {
    res.sendFile('index.html', {root: './dist/public'});
})

usersRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.sendFile('user-detail.html', {root: './dist/public'});
    }
    res.sendStatus(404);
});

usersRouter.get('/:id([0-9]{1,})/news', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.sendFile('news-list.html', {root: './dist/public'});
    }
    res.sendStatus(404);
});


usersRouter.get('/:id([0-9]{1,})/messages', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.sendFile('conversations.html', {root: './dist/public'});
    }
    res.sendStatus(404);
});

export default usersRouter;