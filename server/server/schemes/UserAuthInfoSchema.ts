import ModelSchema from "./ModelSchema";

export default class UserAuthInfoSchema implements ModelSchema {
    id: number = -1;
    username: string = "";
    password: string = "";
    isAdmin: boolean = false;
}