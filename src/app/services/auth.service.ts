import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Objeto de Usuario
export interface User {
  id: number;
  legajo: number;
  name: string;
  rol: 'ADMIN' | 'CASHIER' | string;
}

// Estructura REAL de respuesta de NestJS
export interface LoginResponse {
  success: boolean;
  serverTime: string;
  responseMessage: {
    messageCode: string;
    message: string;
  };
  data: {
    access_token: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/auth';

  login(credentials: { legajo: number; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((res) => {
        // Leemos desde res.data que es la estructura real devuelta por NestJS
        if (res?.data?.access_token && res?.data?.user) {
          localStorage.setItem('token', res.data.access_token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  register(userData: { legajo: number; name: string; password: string; rol: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  getRol(): string | null {
    return this.getUser()?.rol || null;
  }

  esAdmin(): boolean {
    return this.getUser()?.rol === 'ADMIN';
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}