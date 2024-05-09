import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookie = inject(CookieService);
  const user = JSON.parse(cookie.get('ecomUser'));
  console.log('user.role' + user.role);

  // Convert user.role to a number
  const userRole = Number(user.role);

  if (userRole === 0) {
    return true;
  } else {
    return false;
  }
};
