import ModelSchema from "./ModelSchema";

export default class NewsSchema implements ModelSchema {
    id: number = -1;
    authorUsername: string = '';
    authorId: number = -1;
    published: string = "";
    text: string = "";
}