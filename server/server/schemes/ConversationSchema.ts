import ModelSchema from "./ModelSchema";
import MessageSchema from "./MessageSchema";

export default class ConversationSchema implements ModelSchema {
    id: number = -1;
    participants: Array<number> = []
    messages: Array<MessageSchema> = [];
}