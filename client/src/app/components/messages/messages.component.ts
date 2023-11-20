import {Component, OnInit} from '@angular/core';
import {UserInfoService} from "../../services/user-info.service";
import {MessagesService} from "../../services/messages.service";
import {SERVER_URL} from "../../environment";
import {AuthenticationService} from "../../services/authentication.service";

type DialogLinkInfo = {
    dialogId: number
    partnerName: string
    avatar: string
}

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {
    public dialogLinks: Array<DialogLinkInfo> = [];
    public readonly SERVER_URL: string = SERVER_URL;

    constructor(private readonly userInfoService: UserInfoService,
                private readonly messagesService: MessagesService,
                private readonly authService: AuthenticationService) {

    }

    ngOnInit(): void {
        this.messagesService.getUserMessages(<number>this.authService.uid).subscribe(data => {
            for (const dialog of data) {
                const partnerId: number | undefined = dialog.participants.find(id => {
                    return id !== this.authService.uid;
                });

                if (partnerId == null) {
                    continue
                }

                this.userInfoService
                    .getUserInfo(partnerId)
                    .subscribe(user => {
                        this.dialogLinks.push({
                            dialogId: dialog.id,
                            partnerName: user.fullName,
                            avatar: user.avatar
                        });
                    });
            }
        });
    }

}
