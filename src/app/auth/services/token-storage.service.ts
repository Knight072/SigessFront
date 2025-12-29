import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CurrentUser } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly TOKEN_KEY = 'sigess_token';
  private readonly USER_KEY = 'sigess_user';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  saveToken(token: string): void {
    this.storage?.setItem(this.TOKEN_KEY, token);
  }

  token(): string | null {
    return this.storage?.getItem(this.TOKEN_KEY) ?? null;
  }

  saveUser(user: CurrentUser): void {
    this.storage?.setItem(this.USER_KEY, JSON.stringify(user));
  }

  user(): CurrentUser | null {
    const raw = this.storage?.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  getUser(): CurrentUser | null {
    return this.user();
  }

  clear(): void {
    this.storage?.removeItem(this.TOKEN_KEY);
    this.storage?.removeItem(this.USER_KEY);
  }
}
