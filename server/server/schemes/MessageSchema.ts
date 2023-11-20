import ModelSchema from "./ModelSchema";

export default class MessageSchema implements ModelSchema {
    from: number = -1;
    createdAt: string = Date.now().toString();
    text: string = "";
}