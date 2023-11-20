export default class ValidationError implements Error {
    constructor(message: string) {
        this.message = message;
        this.name = "Validation error"
    }

    message: string;
    name: string;
}
