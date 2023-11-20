import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserInfo} from "../interfaces/user-info";
import {Observable} from "rxjs";
import {SERVER_URL} from "../environment";


@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    private readonly usersPath: string = '/api/users';


    constructor(private readonly http: HttpClient) {
    }

    public getUserInfo(userId: number): Observable<UserInfo> {
        return this.http.get<UserInfo>(`${SERVER_URL}${this.usersPath}/${userId}`, {withCredentials: true})
    }

    public updateUserInfo(user: UserInfo) {
        return this.http.put<UserInfo>(`${SERVER_URL}${this.usersPath}/${user.id}`, user, {withCredentials: true});
    }

    public uploadAvatar(avatarFile: File) {
        const fileData = new FormData();
        fileData.append('avatar', avatarFile);
        return this.http.post<string>(`${SERVER_URL}/api/upload/avatar`, fileData);
    }

}
