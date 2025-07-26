import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';


export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService)

  if (authService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false
  }
};