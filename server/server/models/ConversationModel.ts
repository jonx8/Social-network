import Model from "./Model";
import conversations from '../data/conversations.json';
import NotFoundError from "../errors/NotFoundError";
import news from "../data/news.json";
import {writeFile} from "fs";
import path from "path";
import {__jsonStorageDir} from "../config";
import ConversationSchema from "../schemes/ConversationSchema";
import ValidationError from "../errors/ValidationError";
import MessageSchema from "../schemes/MessageSchema";

export default class ConversationModel implements Model {
    all(): Array<ConversationSchema> {
        return conversations;
    }

    create(conversation: ConversationSchema): ConversationSchema {
        conversation.id = this.generateId();
        if (this.findByParticipant(conversation.participants)) {
            throw new ValidationError("Conversation already exists");
        }

        conversations.push(conversation);
        writeFile(path.resolve(__jsonStorageDir, "conversations.json"), JSON.stringify(conversations), err => {
            if (err) throw err;
        });
        return conversation;
    }

    delete(id: number): void {
        const index: number = conversations.findIndex(conversation => conversation.id === id);
        if (index === -1) {
            throw new NotFoundError(`Message with ${id} does not exist`);
        }
        conversations.splice(index, 1);

        writeFile(path.resolve(__jsonStorageDir, 'conversations.json'), JSON.stringify(conversations), err => {
            if (err) throw err;
        })
    }

    findById(id: number): ConversationSchema | undefined {
        return conversations.find(conversation => conversation.id === id);
    }

    findByParticipant(usersList: Array<number>): ConversationSchema | undefined {
        return conversations.find(
            function (elem: ConversationSchema): boolean {
                if (elem.participants.length !== usersList.length) {
                    return false;
                }
                return elem.participants.every(el => usersList.includes(el));
            }
        );
    }

    update(object: ConversationSchema): ConversationSchema {
        const index: number = conversations.findIndex(it => it.id === object.id);
        if (index === -1) {
            throw new NotFoundError(`Conversation with id ${object.id} does not exist`);
        }
        conversations[index].messages = object.messages;
        writeFile(path.resolve(__jsonStorageDir, 'conversations.json'), JSON.stringify(conversations), err => {
            if (err) throw err;
        });
        return object;
    }

    appendMessage(id: number, msg: MessageSchema): void {
        const index: number = conversations.findIndex(it => it.id === id);
        if (index === -1) {
            throw new NotFoundError(`Conversation with id ${id} does not exist`);
        }
        conversations[index].messages.push(msg);

        writeFile(path.resolve(__jsonStorageDir, 'conversations.json'), JSON.stringify(conversations), err => {
            if (err) throw err;
        });
    }


    private generateId(): number {
        if (news.length === 0) return 1;
        return conversations.reduce((prev, curr) => prev.id > curr.id ? prev : curr).id + 1;
    }


}