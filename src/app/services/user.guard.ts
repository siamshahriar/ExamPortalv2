import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from './login.service';

export const userGuard: CanActivateFn = (route, state) => {
    // You cannot use a constructor in a function-based guard.
    // If you need to inject services, use the inject() function:

    const login = inject(LoginService);
    const router = inject(Router);

    if (login.isLoggedIn() && login.getUserRole() === 'NORMAL') {
        return true;
    }

    router.navigate(['/login']);

    return false;
};
