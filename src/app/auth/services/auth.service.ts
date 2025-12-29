import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { CurrentUser, LoginRequest, LoginResponse, Role } from '../models/auth.models';
import { environment } from '../../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = environment.apiBaseUrl;

  constructor(private http: HttpClient, private store: TokenStorageService) { }

  login(req: LoginRequest): Observable<CurrentUser> {
    const url = `${this.base}/auth/login`;

    return this.http
      .post<LoginResponse>(url, req, { observe: 'response' })
      .pipe(
        tap({
          next: (resp: HttpResponse<LoginResponse>) => {
            console.log('[AuthService] Login HTTP status:', resp.status);
            console.log('[AuthService] Login headers:', {
              authorization: resp.headers.get('Authorization'),
              location: resp.headers.get('Location'),
              contentType: resp.headers.get('Content-Type')
            });
            console.log('[AuthService] Login body:', resp.body);
          },
          error: (err: HttpErrorResponse) => {
            console.error('[AuthService] Login ERROR status:', err.status);
            console.error('[AuthService] Login ERROR body:', err.error);
          }
        }),

        map((resp) => {
          const body = resp.body;

          if (!body) {
            throw new Error('Login sin body (resp.body es null).');
          }

          // Aquí ves si realmente viene accessToken
          if (!body.accessToken) {
            console.warn('[AuthService] NO viene accessToken. Body:', body);
            throw new Error('El backend no devolvió accessToken en el body.');
          }

          this.store.clear();
          this.store.saveToken(body.accessToken);
          this.store.saveUser(body.user);

          // Útil para confirmar (si estás en navegador)
          try {
            console.log('[AuthService] Token guardado:', this.store.token());
            console.log('[AuthService] User guardado:', this.store.user());
          } catch { }

          return body.user;
        }),

        catchError((e) => {
          console.error('[AuthService] Login catchError:', e);
          return throwError(() => e);
        })
      );
  }

  logout(): void {
    this.store.clear();
  }

  token(): string | null {
    return this.store.token();
  }

  isLoggedIn(): boolean {
    return !!this.store.token();
  }

  currentUser(): CurrentUser | null {
    return this.store.user();
  }

  hasRole(role: Role): boolean {
    return this.currentUser()?.role === role;
  }
}
