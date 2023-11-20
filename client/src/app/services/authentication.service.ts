import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginData} from "../interfaces/auth-data";
import {Router} from "@angular/router";
import {SERVER_URL} from "../environment";
import {UserInfoService} from "./user-info.service";
import {UserInfo} from "../interfaces/user-info";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public loggedUser?: UserInfo;
    private readonly loginPath: string = '/api/auth/login';

    constructor(private readonly userInfoService: UserInfoService,
                private readonly http: HttpClient,
                private readonly router: Router) {
    }

    logIn(data: LoginData): void {
        this.http
            .post<any>(`${SERVER_URL}${this.loginPath}`, data, {withCredentials: true})
            .subscribe(data => {
                    localStorage.setItem('access_token', data.accessToken);
                    localStorage.setItem('uid', data.id);
                    localStorage.setItem('is_admin', data.isAdmin);
                    this.userInfoService.getUserInfo(data.id).subscribe(async user => {
                        this.loggedUser = user;
                        await this.router.navigate(['/feed']);
                    });
                },
            );
    }

    async logOut(): Promise<void> {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        localStorage.removeItem('is_admin');
        await this.router.navigate(['/login']);
    }

    get isLoggedIn() {
        return localStorage.getItem('access_token') !== null;
    }

    get accessToken() {
        return localStorage.getItem('access_token');
    }

    get uid() {
        const uid: number = parseInt(localStorage.getItem('uid') ?? '');
        return isNaN(uid) ? null : uid;
    }

    get isAdmin() {
        return localStorage.getItem('is_admin');
    }

    getUserData(): Observable<UserInfo> {
        return this.userInfoService.getUserInfo(<number>this.uid);
    }
}
