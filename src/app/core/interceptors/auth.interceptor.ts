// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../../auth/services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(TokenStorageService);
  const token = store.token();

  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  );
};
