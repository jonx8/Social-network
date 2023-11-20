import express, {Router} from 'express';
import UserModel from '../../models/UserModel'
import UserSchema from '../../schemes/UserSchema';
import NotFoundError from "../../errors/NotFoundError";
import NewsModel from '../../models/NewsModel';
import ConversationModel from "../../models/ConversationModel";
import ConversationSchema from "../../schemes/ConversationSchema";
import {profileUpdateValidator} from "../../middleware/validators";
import validationMiddleware from "../../middleware/validationMiddleware";
import UserAuthModel from "../../models/UserAuthModel";

const userModel: UserModel = new UserModel();
const newsModel: NewsModel = new NewsModel();
const userAuthModel: UserAuthModel = new UserAuthModel();
const conversationModel: ConversationModel = new ConversationModel();
const usersAPIRouter: Router = express.Router();


usersAPIRouter.get('/', (_: express.Request, res: express.Response) => {
    res.json(userModel.all())
});

usersAPIRouter.get(`/filter`, (req: express.Request, res: express.Response) => {
    switch (req.query.type) {
        case 'admin':
            return res.status(200)
                .json(userModel.all().filter(user => user.isAdmin));
        case 'active':
            return res.status(200)
                .json(userModel.all().filter(user => user.status === 'Активный'));
        default:
            return res.status(200).json(userModel.all());
    }
});

usersAPIRouter.post('/', (_: express.Request, res: express.Response) => {
    res.status(400).json({message: "Invalid path, use POST /auth/register instead"});
});

usersAPIRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {

    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.status(200).json(user);
    }
    res.sendStatus(404);
});


usersAPIRouter.put('/:id([0-9]{1,})', profileUpdateValidator, validationMiddleware, (req: express.Request, res: express.Response) => {
    const userId = parseInt(req.params.id);
    const user: UserSchema = UserSchema.from(req.body)
    user.id = userId

    try {
        userModel.update(user);
        userAuthModel.updateAdminRole(user.id, user.isAdmin);
        return res.status(200).json(user);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message});
        }
        return res.sendStatus(500);
    }
});

usersAPIRouter.delete('/:id([0-9]{1,})', (req, res) => {
    const userId: number = parseInt(req.params.id);
    try {
        userModel.delete(userId);
        return res.sendStatus(204);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }
});

usersAPIRouter.get('/:id([0-9]){1,}/news', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.status(200).json(newsModel.all().filter(post => {
            return user.friends_id.includes(post.authorId)
        }));
    }
    return res.sendStatus(404);

});


usersAPIRouter.get('/:id([0-9]){1,}/messages', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        const conversations: Array<ConversationSchema> = conversationModel.all()
            .filter(it => it.participants.includes(user.id))

        return res.status(200).json(conversations);
    }
    return res.sendStatus(404);

});


export default usersAPIRouter;

