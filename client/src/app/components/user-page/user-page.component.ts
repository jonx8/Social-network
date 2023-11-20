import {Component, OnInit} from '@angular/core';
import {UserInfoService} from "../../services/user-info.service";
import {UserInfo} from "../../interfaces/user-info";
import {ActivatedRoute, Router} from "@angular/router";
import {NewsService} from "../../services/news.service";
import {NewsInfo} from "../../interfaces/news-info";
import {MessagesService} from "../../services/messages.service";
import {SERVER_URL} from "../../environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FriendsService} from "../../services/friends.service";
import {AuthenticationService} from "../../services/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {EditAvatarDialogComponent} from "../edit-avatar-dialog/edit-avatar-dialog.component";

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.less']
})
export class UserPageComponent implements OnInit {
    public userData?: UserInfo;
    public newsList: Array<NewsInfo> = [];
    public newPostForm: FormGroup;
    public isFriend: boolean = false;
    public isAuthUser: boolean = false;
    public readonly SERVER_URL: string = SERVER_URL;
    private userId?: number;


    constructor(private readonly authService: AuthenticationService,
                private readonly userInfoService: UserInfoService,
                private readonly messagesService: MessagesService,
                private readonly newsService: NewsService,
                private readonly friendsService: FriendsService,
                private readonly router: Router,
                private readonly route: ActivatedRoute,
                public readonly dialog: MatDialog
    ) {
        this.newPostForm = new FormGroup({
            text: new FormControl(null, [
                Validators.required,
                Validators.maxLength(500)
            ])
        });
    }

    ngOnInit(): void {
        this.authService.getUserData().subscribe(user => {
            this.authService.loggedUser = user;
            if (this.router.url === '/profile') {
                this.userId = this.authService.loggedUser.id;
                this.isAuthUser = true;
            } else {
                this.userId = parseInt(this.route.snapshot.paramMap.get('id') ?? '-1');
                this.isFriend = this.authService.loggedUser.friends_id.includes(this.userId) || false;
                this.isAuthUser = this.userId === this.authService.loggedUser.id;
            }
            this.userInfoService.getUserInfo(this.userId).subscribe(data => {
                this.userData = data;
            });

            this.newsService.getUserPosts(this.userId).subscribe(data => {
                this.newsList = data;
            });
        });

        this.newsService.getPosts().subscribe(post => {
            if (post.authorId === this.userId) {
                this.newsList.unshift(post);
            }
        })
    }

    openDialog(friendId: number): void {
        this.messagesService
            .getUserMessages(this.authService.loggedUser!.id)
            .subscribe(async dialogs => {
                const index: number = dialogs.findIndex(dialog => {
                    return dialog.participants.includes(friendId)
                });
                if (index !== -1) {
                    await this.router.navigate(['/dialog', dialogs[index].id]);
                } else {
                    this.messagesService
                        .createDialog(this.authService.loggedUser!.id, friendId)
                        .subscribe(async dialog => {
                            await this.router.navigate(['/dialog', dialog.id]);
                        });
                }
            })
    }

    submitPost(): void {
        if (this.newPostForm.valid) {
            const data: NewsInfo = {
                id: -1,
                authorId: this.userData!.id,
                authorUsername: this.userData!.username,
                published: new Date().toISOString(),
                text: this.newPostForm.get('text')?.value
            };
            this.newsService.sendNewPost(data);
        }
    }

    addFriend(): void {
        this.friendsService.addFriend(this.authService.loggedUser!.id, this.userId!).subscribe({
            next: () => {
                this.isFriend = true;
            },
            error: err => {
                console.log(err);
            }
        });
    }

    removeFriend(): void {
        this.friendsService.removeFriend(this.authService.loggedUser!.id, this.userId!).subscribe({
            next: () => {
                this.isFriend = false;
            },
            error: err => {
                console.log(err);
            }
        });
    }

    editAvatarDialog() {
        const dialogRef = this.dialog.open(EditAvatarDialogComponent);

        dialogRef.afterClosed().subscribe(() => {
            this.userData = this.authService.loggedUser;
        })
    }

}
