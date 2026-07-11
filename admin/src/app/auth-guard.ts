import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  console.log("AUTH GUARD RUNNING");

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  console.log("Logged in status:", isLoggedIn);

  if (isLoggedIn) {
    return true;
  }

  return router.createUrlTree(['/login']);
};