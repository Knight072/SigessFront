import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanMatchFn, Router } from '@angular/router';
import { TokenStorageService } from '../../auth/services/token-storage.service';

export const roleGuard = (role: string): CanMatchFn => {
  return () => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) return true;

    const router = inject(Router);
    const tokenStorage = inject(TokenStorageService);

    const user = tokenStorage.getUser();
    if (!user) return router.parseUrl('/login');

    const userRole = String((user as any).role || '').toUpperCase();
    const required = String(role || '').toUpperCase();

    return userRole === required ? true : router.parseUrl('/incidents');
  };
};
