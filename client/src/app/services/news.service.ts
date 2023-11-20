import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {NewsInfo} from "../interfaces/news-info";
import {SERVER_SOCKET_URL, SERVER_URL} from "../environment";
import {io, Socket} from "socket.io-client";

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private readonly socket: Socket = io(SERVER_SOCKET_URL);
    private readonly newsPath: string = '/api/news';


    constructor(private readonly http: HttpClient) {

    }

    sendNewPost(postData: NewsInfo) {
        this.socket.emit('post', postData);
        this.http.post(`${SERVER_URL}${this.newsPath}`, postData, {
            withCredentials: true
        }).subscribe();
    }

    getPosts(): Observable<NewsInfo> {
        return new Observable(observer => {
            this.socket.on('post', data => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect()
            };
        });
    }

    getUserPosts(userId: number): Observable<Array<NewsInfo>> {
        return this.http.get<Array<NewsInfo>>(`${SERVER_URL}${this.newsPath}`, {
            withCredentials: true,
            params: new HttpParams().set('userId', userId)
        });
    }

    getFeedForUser(userId: number): Observable<Array<NewsInfo>> {
        return this.http.get<Array<NewsInfo>>(`${SERVER_URL}/api/users/${userId}/news`, {
            withCredentials: true
        });
    }
}
