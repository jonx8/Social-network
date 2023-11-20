import ModelSchema from "./ModelSchema";

const defaultAvatarURL = '/public/images/default-avatar.png'

export default class UserSchema implements ModelSchema {
    id: number = -1;
    username: string = "";
    email: string = "";
    fullName: string = "";
    birthDate: string = "";
    avatar: string = defaultAvatarURL;
    status: string = "Активный";
    isAdmin: boolean = false;
    friends_id: number[] = [];

    static from(obj: object): UserSchema {
        return Object.assign(new UserSchema(), obj);
    }

}
