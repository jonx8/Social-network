import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = async (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const authService: AuthenticationService = inject(AuthenticationService);
    const router: Router = inject(Router);

    if (authService.isLoggedIn) {
        return true;
    }
    await router.navigate(['/login']);
    return false;
};
