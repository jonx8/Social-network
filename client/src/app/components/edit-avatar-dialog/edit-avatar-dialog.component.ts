import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {UserInfoService} from "../../services/user-info.service";
import {UserInfo} from "../../interfaces/user-info";

@Component({
    selector: 'app-edit-avatar-dialog',
    templateUrl: './edit-avatar-dialog.component.html',
    styleUrls: ['./edit-avatar-dialog.component.less']
})
export class EditAvatarDialogComponent {
    public readonly avatarForm: FormGroup;
    private readonly defaultAvatarPath: string = '/public/images/default-avatar.png';
    private file: File | null = null;

    constructor(private readonly authService: AuthenticationService,
                private readonly userInfoService: UserInfoService) {
        this.avatarForm = new FormGroup({
            avatar: new FormControl(null)
        });
    }

    public resetAvatar(): void {
        const user: UserInfo | undefined = this.authService.loggedUser;
        if (user == null) {
            return;
        }

        user.avatar = this.defaultAvatarPath;
        this.userInfoService.updateUserInfo(user).subscribe(user => {
            this.authService.loggedUser = user;
        });
    }


    public updateAvatar(): void {
        if (this.file) {
            this.userInfoService
                .uploadAvatar(this.file)
                .subscribe(avatarUrl => {
                    const user = this.authService.loggedUser;
                    if (user == null) {
                        return
                    }
                    user.avatar = avatarUrl;
                    this.userInfoService.updateUserInfo(user).subscribe(updatedUser => {
                        this.authService.loggedUser = updatedUser;
                    });
                });
        }

    }

    onChange(event: any) {
        this.file = event.target.files[0] || null;
    }
}
