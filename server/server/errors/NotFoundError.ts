export default class NotFoundError implements Error {
    constructor(message: string) {
        this.message = message;
        this.name = "NotFoundError";
    }

    message: string;
    name: string;
}
