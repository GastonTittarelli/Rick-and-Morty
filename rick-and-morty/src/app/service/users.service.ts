import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../shared/interfaces/auth-interfaces'


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api-auth-moby.herokuapp.com/api/user/login';

  constructor(private http: HttpClient) {}

  login(mail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { mail, password });
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
  const registerUrl = 'https://api-auth-moby.herokuapp.com/api/user/register';
  return this.http.post<RegisterResponse>(registerUrl, userData);
}

  // Guarda los datos en localStorage o sessionStorage según `rememberMe`
  saveSession(token: string, user: any, remember: boolean): void {
    if (remember) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  //limpia la sesión de ambos lados
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  // Devuelve si hay sesión activa
  isLoggedIn(): boolean {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  }

  // Obtener token sin importar si está en localStorage o sessionStorage
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Obtener usuario actual
  getUser(): any {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
