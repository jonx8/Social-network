import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {RegisterFormComponent} from "./components/register-form/register-form.component";
import {NotFoundPageComponent} from "./components/not-found-page/not-found-page.component";
import {NewsFeedComponent} from "./components/news-feed/news-feed.component";
import {UserPageComponent} from "./components/user-page/user-page.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {DialogComponent} from "./components/dialog/dialog.component";
import {authGuard} from "./guards/auth.guard";
import {FriendsListComponent} from "./components/friends-list/friends-list.component";

const routes: Routes = [
    {path: '', redirectTo: 'feed', pathMatch: 'full'},
    {path: 'login', component: LoginFormComponent},
    {path: 'register', component: RegisterFormComponent},
    {path: 'profile', component: UserPageComponent, canActivate: [authGuard]},
    {path: 'friends', component: FriendsListComponent, canActivate: [authGuard]},
    {path: 'friends/:id', component: FriendsListComponent, canActivate: [authGuard]},
    {path: 'messages', component: MessagesComponent, canActivate: [authGuard]},
    {path: 'dialog/:id', component: DialogComponent, canActivate: [authGuard]},
    {path: 'feed', component: NewsFeedComponent, canActivate: [authGuard]},
    {path: 'users/:id', component: UserPageComponent, canActivate: [authGuard]},
    {path: '**', component: NotFoundPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
