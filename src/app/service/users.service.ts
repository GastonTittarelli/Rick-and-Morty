import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  header: {
    message?: string;
    error?: string;
    resultCode: number;
  };
  data: {
    user: {
      id: string;
      role: string;
      name: string;
      mail: string;
      address: {
        street: string;
        location: string;
        city: string;
        country: string;
        cp: string;
      };
      birthday: string; // o Date, ver
      phone: string;
    };
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api-auth-moby.herokuapp.com/api/user/login';

  constructor(private http: HttpClient) {}

  login(mail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { mail, password });
  }
}
