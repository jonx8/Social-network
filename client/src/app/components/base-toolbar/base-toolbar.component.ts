import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {SERVER_URL} from "../../environment";


@Component({
    selector: 'app-base-toolbar',
    templateUrl: './base-toolbar.component.html',
    styleUrls: ['./base-toolbar.component.less']
})
export class BaseToolbarComponent {
    constructor(private readonly router: Router,
                public readonly authService: AuthenticationService) {
    }

    async navigate(path: string): Promise<void> {
        await this.router.navigate(['/', path])
    }

    async logOutClick(): Promise<void> {
        await this.authService.logOut();
    }

    protected readonly window = window;
    protected readonly SERVER_URL = SERVER_URL;
}
