import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {SERVER_URL} from "../../environment";

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.less']
})
export class RegisterFormComponent {
    public registerForm: FormGroup;
    private readonly registerPath: string = '/api/auth/register';

    constructor(private http: HttpClient, private router: Router) {

        this.registerForm = new FormGroup({
            username: new FormControl(null, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(32)
            ]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            fullName: new FormControl(null, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(50)
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20)
            ])
        })
    }

    submit() {
        if (this.registerForm.valid) {
            const data = {
                username: this.registerForm.get('username')!.value,
                password: this.registerForm.get('password')!.value,
                fullName: this.registerForm.get('fullName')!.value,
                email: this.registerForm.get('email')!.value
            }
            this.http.post(`${SERVER_URL}${this.registerPath}`, data)
                .subscribe({
                    next: async () => {
                        await this.router.navigate(['/feed'])
                    }
                });
        }
    }

}
