import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Dialog, Message} from "../interfaces/dialog";
import {SERVER_SOCKET_URL, SERVER_URL} from '../environment'
import {io, Socket} from "socket.io-client";

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    private readonly socket: Socket = io(SERVER_SOCKET_URL);
    private readonly messagesPath: string = '/api/messages';

    constructor(private readonly http: HttpClient) {
    }

    sendMessage(dialogId: number, message: Message) {
        this.socket.emit('message', {
            message: message,
            dialogId: dialogId
        });
        this.http.post(`${SERVER_URL}${this.messagesPath}/${dialogId}`, message, {
            withCredentials: true
        }).subscribe({
            error: err => {
                console.log(err)
            }
        });
    }

    getMessages(dialogId: number): Observable<Message> {
        return new Observable(observer => {
            this.socket.on('message', data => {
                if (dialogId === data.dialogId) {
                    observer.next(data.message);
                }
            });
            return () => {
                this.socket.disconnect()
            };
        });
    }

    getUserMessages(userId: number): Observable<Array<Dialog>> {
        return this.http.get<Array<Dialog>>(`${SERVER_URL}/api/users/${userId}/messages`, {
            withCredentials: true
        });
    }


    getDialog(dialogId: number): Observable<Dialog> {
        return this.http.get<Dialog>(`${SERVER_URL}${this.messagesPath}/${dialogId}`, {
            withCredentials: true
        });
    }

    createDialog(firstId: number, secondId: number): Observable<Dialog> {
        return this.http.post<Dialog>(`${SERVER_URL}${this.messagesPath}`, {
            first: firstId,
            second: secondId
        }, {withCredentials: true});
    }

}
