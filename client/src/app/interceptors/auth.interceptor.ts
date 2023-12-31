import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private readonly authService: AuthenticationService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authService.accessToken}`
            }
        });
        return next.handle(request);
    }
}

