import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FooterComponentComponent} from './components/footer-component/footer-component.component';
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {NewsFeedComponent} from './components/news-feed/news-feed.component';
import {BaseToolbarComponent} from './components/base-toolbar/base-toolbar.component';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {UserPageComponent} from './components/user-page/user-page.component';
import {NgOptimizedImage} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {UnauthorizedToolbarComponent} from './components/unauthorized-toolbar/unauthorized-toolbar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MessagesComponent} from './components/messages/messages.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {DateSortPipe} from './pipes/date-sort.pipe';
import {MatSelectModule} from "@angular/material/select";
import {FriendsListComponent} from './components/friends-list/friends-list.component';
import {NewsSortPipe} from './pipes/news-sort.pipe';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import { EditAvatarDialogComponent } from './components/edit-avatar-dialog/edit-avatar-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
    declarations: [
        AppComponent,
        LoginFormComponent,
        FooterComponentComponent,
        RegisterFormComponent,
        NewsFeedComponent,
        BaseToolbarComponent,
        UserPageComponent,
        NotFoundPageComponent,
        UnauthorizedToolbarComponent,
        MessagesComponent,
        DialogComponent,
        DateSortPipe,
        FriendsListComponent,
        NewsSortPipe,
        EditAvatarDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatButtonToggleModule,
        FormsModule,
        MatInputModule,
        MatCardModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        NgOptimizedImage,
        MatListModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSelectModule,
        MatDialogModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
