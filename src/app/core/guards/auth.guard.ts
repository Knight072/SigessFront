import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const authGuard: CanMatchFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return true;

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};
