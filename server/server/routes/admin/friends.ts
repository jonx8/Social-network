import express, {Router} from "express";
import UserModel from "../../models/UserModel";
import UserSchema from "../../schemes/UserSchema";

const friendsRouter: Router = express.Router();
const userModel: UserModel = new UserModel();
friendsRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const userId: number = parseInt(req.params.id);
    const user: UserSchema | undefined = userModel.findById(userId);
    if (user) {
        return res.sendFile('friends.html', {root: './dist/public'});
    }
    res.sendStatus(404);
});


export default friendsRouter;