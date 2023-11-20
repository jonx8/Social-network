import {Component, OnInit} from '@angular/core';
import {NewsService} from "../../services/news.service";
import {NewsInfo} from "../../interfaces/news-info";
import {UserInfo} from "../../interfaces/user-info";
import {AuthenticationService} from "../../services/authentication.service";


@Component({
    selector: 'app-news-feed',
    templateUrl: './news-feed.component.html',
    styleUrls: ['./news-feed.component.less']
})
export class NewsFeedComponent implements OnInit {
    public newsList: Array<NewsInfo> = [];
    private userData?: UserInfo;


    constructor(private readonly newsService: NewsService,
                private readonly authService: AuthenticationService
    ) {

    }

    ngOnInit(): void {
        this.authService.getUserData().subscribe(user => {
            this.userData = user;
            this.newsService.getPosts().subscribe(post => {
                if (this.userData?.friends_id.includes(post.authorId)) {
                    this.newsList.unshift(post);
                }
            });

            this.newsService.getFeedForUser(this.userData!.id).pipe().subscribe(data => {
                this.newsList = data;
            });
        });

    }
}
