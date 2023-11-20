import {Component, OnInit} from '@angular/core';
import {UserInfo} from "../../interfaces/user-info";
import {MessagesService} from "../../services/messages.service";
import {UserInfoService} from "../../services/user-info.service";
import {Message} from "../../interfaces/dialog";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.less']
})
export class DialogComponent implements OnInit {
    public users: Map<number, UserInfo> = new Map<number, UserInfo>();
    public messages: Array<Message> = [];
    public newMessageForm: FormGroup;
    public readonly dialogId: number;


    constructor(private readonly userInfoServices: UserInfoService,
                private readonly authService: AuthenticationService,
                private readonly messagesService: MessagesService,
                private readonly route: ActivatedRoute) {
        this.dialogId = parseInt(this.route.snapshot.paramMap.get('id') ?? "");
        this.newMessageForm = new FormGroup({
            text: new FormControl(null, [
                Validators.required,
                Validators.maxLength(300)
            ])
        });
    }

    ngOnInit(): void {
        this.authService.getUserData().subscribe(user => {
            this.authService.loggedUser = user;
        });

        this.messagesService.getMessages(this.dialogId).subscribe(message => {
            this.messages.push(message);
        });

        this.messagesService.getDialog(this.dialogId).subscribe({
            next: dialog => {
                console.log(dialog)
                this.messages = dialog.messages;
                dialog.participants.forEach(id => {
                    this.userInfoServices.getUserInfo(id).subscribe(user => {
                        this.users.set(id, user);
                    });
                });
            }
        });
    }

    submitMessage(): void {
        if (this.newMessageForm.valid) {
            const message: Message = {
                createdAt: new Date().toISOString(),
                from: -1,
                text: this.newMessageForm.get('text')!.value
            }
            message.from = this.authService.loggedUser!.id;
            this.messagesService.sendMessage(this.dialogId, message);
        }
    }
}
