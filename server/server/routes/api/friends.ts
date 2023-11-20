import express, {Router} from "express";
import UserSchema from "../../schemes/UserSchema";
import UserModel from "../../models/UserModel";
import NotFoundError from "../../errors/NotFoundError";

const userModel: UserModel = new UserModel();
const friendsAPIRouter: Router = express.Router();

friendsAPIRouter.get('/:id([0-9]{1,})',
    function (req: express.Request, res: express.Response) {
        const userId: number = parseInt(req.params.id);
        const user: UserSchema | undefined = userModel.findById(userId);
        if (user) {
            const friendsList: Array<number> = user.friends_id;
            return res.json(userModel.all().filter(elem => friendsList.includes(elem.id)));
        }
        return res.sendStatus(404);
    }
);


friendsAPIRouter.post('/:id([0-9]{1,})', (req, res) => {
    const userId: number = parseInt(req.params.id);
    const friendId: number = parseInt(req.body.value);
    if (isNaN(friendId) && req.body.oper) {
        return res.status(400).json({message: "Invalid request format"});
    }

    try {
        switch (req.body.oper) {
            case 'add':
                userModel.addFriend(userId, friendId);
                break;
            case 'remove':
                userModel.removeFriend(userId, friendId);
                break;
            default:
                return res.status(400).json('incorrect type of "oper" field');
        }

        const user: UserSchema | undefined = userModel.findById(userId);
        if (user) {
            const friendsList: Array<number> = user.friends_id;
            return res.json(userModel.all()
                .filter(elem => friendsList.includes(elem.id)));
        }

    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }
});


friendsAPIRouter.patch('/:id([0-9]{1,})', (req, res) => {
    const userId: number = parseInt(req.params.id);
    const friendId: number = parseInt(req.body.value);

    if (req.body.op !== 'remove' || req.body.path !== 'friends' || isNaN(friendId)) {
        return res.status(400).json({message: "Invalid request format"});
    }

    try {
        userModel.removeFriend(userId, friendId);
        return res.sendStatus(204);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }
});

export default friendsAPIRouter;