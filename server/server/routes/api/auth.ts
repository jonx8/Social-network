import express, {Router} from "express";
import UserModel from "../../models/UserModel";
import UserSchema from "../../schemes/UserSchema";
import validationMiddleware from "../../middleware/validationMiddleware";
import {signUpValidator} from "../../middleware/validators";
import UserAuthInfoSchema from "../../schemes/UserAuthInfoSchema";
import UserAuthModel from "../../models/UserAuthModel";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../../config";
import bcrypt from "bcrypt";
import {rollbar} from "../../app";
import {stringify} from "ts-jest";

const authAPIRouter: Router = express.Router();
const userModel: UserModel = new UserModel();
const userAuthModel: UserAuthModel = new UserAuthModel();

authAPIRouter.post('/login', async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({message: 'Missing credentials'});
    }

    const user: UserAuthInfoSchema | undefined = userAuthModel.findByUsername(username);
    if (!user || !await bcrypt.compare(password, user.password)) {
        rollbar.warning("Authentication failed ")
        return res.status(401).json({message: 'Authentication failed'});
    }

    const token: string = jwt.sign({
        id: user.id,
        isAdmin: user.isAdmin,
        username: user.username
    }, SECRET_KEY, {
        expiresIn: 60 * 60 // one hour
    });
    rollbar.debug("JWT Token is signed");
    res.json({accessToken: token, id: user.id, isAdmin: user.isAdmin});
});


authAPIRouter.post('/register', signUpValidator, validationMiddleware, async (req: express.Request, res: express.Response) => {
    let user: UserSchema = new UserSchema();
    user.username = req.body.username;
    user.email = req.body.email;
    user.fullName = req.body.fullName;

    let authInfo: UserAuthInfoSchema = new UserAuthInfoSchema();
    authInfo.username = req.body.username;
    authInfo.password = req.body.password;

    try {
        user = userModel.create(user);
        authInfo.id = user.id;
        await userAuthModel.create(authInfo);
    } catch (e) {
        console.log(e);
        rollbar.error(stringify(e));
        return res.sendStatus(500);
    }
    rollbar.info(`User ${user.username} is registered`)
    return res.status(201).json(user);
});
export default authAPIRouter;