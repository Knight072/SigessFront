export type Role = 'ANALISTA' | 'SUPERVISOR';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  user: CurrentUser;
}

/**
 * Lo que guardamos como usuario “actual”.
 * fullName es opcional para que NO rompa tu app.component.html.
 */
export interface CurrentUser {
  username: string;
  role: Role;
  fullName?: string;
}

/** Alias para evitar tu error de import "UserInfo" */
export type UserInfo = CurrentUser;
