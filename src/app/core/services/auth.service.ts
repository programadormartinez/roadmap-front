import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://roadmap-back-production.up.railway.app/api/auth';

  // Signals to manage state
  currentUser = signal<AuthResponse | null>(this.getUserFromStorage());

  constructor() {}

  private getUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    // The interceptor will attach the current token.
    // If we don't have a token, we can't refresh.
    const token = this.getToken();
    if (!token) {
        return throwError(() => new Error('No token available'));
    }

    // The user said "refresh que tiene que ir la authorization a traves el RequestHeader"
    // Usually refresh endpoints might return a new token.
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(response));
    this.currentUser.set(response);
  }

  getToken(): string | null {
    return this.currentUser()?.access_token || null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Assuming 'jti' holds the user ID based on the provided token example
      return payload.jti ? Number(payload.jti) : null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
