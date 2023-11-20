import Model from "./Model";
import users from '../data/users.json';
import {writeFile} from 'fs';
import UserSchema from "../schemes/UserSchema";
import path from "path";
import {__jsonStorageDir} from "../config";
import NotFoundError from "../errors/NotFoundError";
import UserAuthModel from "./UserAuthModel";

const userAuthModel: UserAuthModel = new UserAuthModel();


export default class UserModel implements Model {
    all(): Array<UserSchema> {
        return users;
    }


    findById(id: number): UserSchema | undefined {
        return users.find(user => user.id === id);
    }

    findByUsername(username: string): UserSchema | undefined {
        return users.find(user => user.username === username);
    }

    create(user: UserSchema): UserSchema {
        user.id = this.generateId();
        users.push(user);

        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(users), err => {
            if (err) throw err
        });

        return user;
    }

    update(user: UserSchema): UserSchema {
        const index: number = users.findIndex(obj => obj.id === user.id);
        if (index === -1) {
            throw new NotFoundError(`User with id ${user.id} does not exist`);
        }
        const friendsList: Array<number> = users[index].friends_id;
        users[index] = user;
        users[index].friends_id = friendsList;

        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(users), err => {
            if (err) throw err
        });

        return user;
    }


    delete(id: number): void {
        const index: number = users.findIndex(elem => elem.id === id);
        if (index === -1) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
        users.splice(index, 1);
        userAuthModel.delete(id);
        users.forEach(user => {
            user.friends_id = user.friends_id.filter(friendId => friendId !== id)
        });


        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(users), err => {
            if (err) throw err;
        })

    }


    addFriend(userID: number, friendId: number): void {
        const user: UserSchema | undefined = this.findById(userID);
        const friend: UserSchema | undefined = this.findById(friendId);
        if (!user || !friend) {
            throw new NotFoundError(`User with id: ${user ? userID : friendId} does not exist`);
        }

        user.friends_id.push(friendId)
        friend.friends_id.push(userID);

        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(users), err => {
            if (err) throw err;
        })

    }

    removeFriend(userID: number, friendId: number): void {
        const user: UserSchema | undefined = this.findById(userID);
        const friend: UserSchema | undefined = this.findById(friendId);
        if (!user || !friend) {
            throw new NotFoundError(`User with id: ${user ? userID : friendId} does not exist`);
        }

        user.friends_id = user.friends_id.filter(id => id !== friendId);
        friend.friends_id = friend.friends_id.filter(id => id !== userID);

        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(users), err => {
            if (err) throw err;
        })

    }

    private generateId(): number {
        if (users.length === 0) return 1;
        return users.reduce((prev, curr) => prev.id > curr.id ? prev : curr).id + 1;
    }

}