import express, {Router} from "express";
import NotFoundError from "../../errors/NotFoundError";
import ConversationModel from "../../models/ConversationModel";
import ConversationSchema from "../../schemes/ConversationSchema";
import MessageSchema from "../../schemes/MessageSchema";
import ValidationError from "../../errors/ValidationError";

const conversationModel: ConversationModel = new ConversationModel();
const messagesAPIRouter: Router = express.Router();

messagesAPIRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const conversationId: number = parseInt(req.params.id);
    const conversation: ConversationSchema | undefined = conversationModel.findById(conversationId);
    if (conversation) {
        return res.status(200).json(conversation);
    }
    return res.sendStatus(404);
});

messagesAPIRouter.post('/', (req: express.Request, res: express.Response) => {
    const firstUserId: number = parseInt(req.body['first']);
    const secondUserId: number = parseInt(req.body['second']);
    if (isNaN(firstUserId) || isNaN(secondUserId)) {
        return res.sendStatus(400);
    }

    const conversation: ConversationSchema = new ConversationSchema();
    conversation.participants.push(firstUserId, secondUserId);

    try {
        const newConversation: ConversationSchema = conversationModel.create(conversation);
        res.status(201).json(newConversation);
    } catch (e) {
        if (e instanceof ValidationError) {
            res.status(400).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }
});


messagesAPIRouter.post('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const conversationId: number = parseInt(req.params.id);
    let message: MessageSchema = {...req.body};
    try {
        conversationModel.appendMessage(conversationId, message);
        return res.sendStatus(201);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message});
        }
        console.log(e);
        res.sendStatus(500);
    }

});


messagesAPIRouter.patch('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const conversationId: number = parseInt(req.params.id);
    let message: MessageSchema = {...req.body};

    try {
        conversationModel.appendMessage(conversationId, message);
        return res.sendStatus(201);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }
});


messagesAPIRouter.delete('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const conversationId: number = parseInt(req.params.id);
    try {
        conversationModel.delete(conversationId);
        return res.sendStatus(204);
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).json({message: e.message});
        }
        console.log(e);
        return res.sendStatus(500);
    }

})

export default messagesAPIRouter;