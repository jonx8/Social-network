import express, {Router} from 'express';
import ConversationModel from "../../models/ConversationModel";
import ConversationSchema from "../../schemes/ConversationSchema";

const messagesRouter: Router = express.Router();
const conversationModel: ConversationModel = new ConversationModel();


messagesRouter.get('/:id([0-9]{1,})', (req: express.Request, res: express.Response) => {
    const conversationId: number = parseInt(req.params.id);
    const conversation: ConversationSchema | undefined = conversationModel.findById(conversationId);
    if (conversation) {
        return res.sendFile('conversation-detail.html', {root: './dist/public'});
    }
    res.sendStatus(404);
});

export default messagesRouter;
