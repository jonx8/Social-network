import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserInfo} from "../../interfaces/user-info";
import {FriendsService} from "../../services/friends.service";
import {SERVER_URL} from "../../environment";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'app-friends-list',
    templateUrl: './friends-list.component.html',
    styleUrls: ['./friends-list.component.less']
})
export class FriendsListComponent implements OnInit {
    public friendsList: Array<UserInfo> = [];
    public userId: number;
    public isAuthUser: boolean = false;
    public readonly SERVER_URL: string = SERVER_URL;

    constructor(
        public readonly authService: AuthenticationService,
        private readonly friendsService: FriendsService,
        private readonly route: ActivatedRoute
    ) {
        this.userId = parseInt(this.route.snapshot.paramMap.get('id') ?? '');
    }

    ngOnInit(): void {
        if (isNaN(this.userId) || this.userId === this.authService.uid) {
            this.isAuthUser = true;
            this.userId = <number>this.authService.uid;
        }

        this.friendsService.getUserFriends(this.userId).subscribe(friends => {
            this.friendsList = friends;
        });
    }


    removeFriend(friendId: number): void {
        this.friendsService.removeFriend(<number>this.authService.uid, friendId).subscribe(data => {
            if (this.isAuthUser) {
                this.friendsList = data;
            }
        });
    }

}
