import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, RegisterResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3333/api/auth';

  // Signals para gerenciamento de estado moderno
  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(localStorage.getItem('finance_token'));
  isAuthenticated = computed(() => !!this.token());

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('finance_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.token.set(res.token);
        this.currentUser.set(res.user);
        localStorage.setItem('finance_token', res.token);
        localStorage.setItem('finance_user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      })
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('finance_token');
    localStorage.removeItem('finance_user');
    this.router.navigate(['/login']);
  }
}
