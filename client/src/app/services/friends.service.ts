import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../interfaces/user-info";
import {Observable} from "rxjs";
import {SERVER_URL} from "../environment";

@Injectable({
    providedIn: 'root'
})
export class FriendsService {
    private readonly friendsPath: string = '/api/friends';

    constructor(private readonly http: HttpClient) {
    }

    getUserFriends(userId: number): Observable<UserInfo[]> {
        return this.http.get<Array<UserInfo>>(`${SERVER_URL}${this.friendsPath}/${userId}`, {
            withCredentials: true
        });
    }

    removeFriend(userId: number, friendId: number): Observable<Array<UserInfo>> {
        return this.http.post<Array<UserInfo>>(`${SERVER_URL}${this.friendsPath}/${userId}`, {
            oper: 'remove',
            value: friendId
        }, {withCredentials: true});
    }


    addFriend(userId: number, friendId: number): Observable<UserInfo[]> {
        return this.http.post<Array<UserInfo>>(`${SERVER_URL}${this.friendsPath}/${userId}`, {
            oper: 'add',
            value: friendId
        }, {withCredentials: true});
    }
}
