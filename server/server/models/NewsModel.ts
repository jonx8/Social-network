import Model from "./Model";
import news from '../data/news.json';
import {writeFile} from 'fs';
import path from "path";
import {__jsonStorageDir} from "../config";
import NewsSchema from "../schemes/NewsSchema";
import NotFoundError from "../errors/NotFoundError";


export default class NewsModel implements Model {
    all(): Array<NewsSchema> {
        return news;
    }


    findById(id: number): NewsSchema | undefined {
        return news.find(post => post.id === id);
    }

    create(post: NewsSchema): NewsSchema {
        post.id = this.generateId();
        news.push(post);

        writeFile(path.resolve(__jsonStorageDir, 'users.json'), JSON.stringify(news), err => {
            if (err) throw err
        });

        return post;
    }


    update(post: NewsSchema): NewsSchema {
        const index: number = news.findIndex(obj => obj.id === post.id);
        if (index === -1) {
            throw new NotFoundError(`Post with id ${post.id} does not exist`);
        }
        news[index] = post;

        writeFile(path.resolve(__jsonStorageDir, 'news.json'), JSON.stringify(news), err => {
            if (err) throw err
        });

        return post;
    }


    delete(id: number): void {
        const index: number = news.findIndex(elem => elem.id === id);
        if (index === -1) {
            throw new NotFoundError(`Post with id ${id} does not exist`)
        }
        news.splice(index, 1);

        writeFile(path.resolve(__jsonStorageDir, 'news.json'), JSON.stringify(news), err => {
            if (err) throw err;
        })

    }

    private generateId(): number {
        if (news.length === 0) return 1;
        return news.reduce((prev, curr) => prev.id > curr.id ? prev : curr).id + 1;
    }

}