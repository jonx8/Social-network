import Model from "./Model";
import ModelSchema from "../schemes/ModelSchema";
import authData from '../data/users-auth-info.json';
import UserAuthInfoSchema from "../schemes/UserAuthInfoSchema";
import {writeFile} from "fs";
import path from "path";
import {__jsonStorageDir} from "../config";
import NotFoundError from "../errors/NotFoundError";
import bcrypt from "bcrypt";

export default class UserAuthModel implements Model {
    findById(id: number): UserAuthInfoSchema | undefined {
        return authData.find(user => user.id === id);
    }

    findByUsername(username: string) {
        return authData.find(user => user.username === username);
    }

    all(): Array<UserAuthInfoSchema> {
        return authData;
    }

    async create(authInfo: UserAuthInfoSchema): Promise<UserAuthInfoSchema> {
        const salt = await bcrypt.genSalt(10);
        authInfo.password = await bcrypt.hash(authInfo.password, salt);

        authData.push(authInfo);
        writeFile(path.resolve(__jsonStorageDir, 'users-auth-info.json'), JSON.stringify(authData), err => {
            if (err) throw err
        });
        return authInfo;
    }

    delete(id: number): void {
        const index = authData.findIndex(user => user.id === id);
        if (index === -1) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
        authData.splice(index, 1);
        writeFile(path.resolve(__jsonStorageDir, 'users-auth-info.json'), JSON.stringify(authData), err => {
            if (err) throw err
        });
    }

    update(object: ModelSchema): ModelSchema {
        return object;
    }

    updateAdminRole(id: number, value: boolean) {
        const index = authData.findIndex(user => user.id === id);
        if (index === -1) {
            throw new NotFoundError(`User with id ${id} does not exist`);
        }
        authData[index].isAdmin = value;

        writeFile(path.resolve(__jsonStorageDir, 'users-auth-info.json'), JSON.stringify(authData), err => {
            if (err) throw err
        });
    }
}