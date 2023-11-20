import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginData} from "../../interfaces/auth-data";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.less']
})
export class LoginFormComponent {
    public loginForm: FormGroup;
    public unauthorized: boolean = false;

    constructor(private authService: AuthenticationService) {
        this.loginForm = new FormGroup({
                username: new FormControl(null, [
                    Validators.minLength(4),
                    Validators.maxLength(32),
                    Validators.required
                ]),
                password: new FormControl(null, [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(20)
                ])
            }
        )
    }

    submit() {
        if (this.loginForm.valid) {
            const data: LoginData = {
                username: this.loginForm.get('username')!.value,
                password: this.loginForm.get('password')!.value
            }
            this.authService.logIn(data);

        }
    }
}
