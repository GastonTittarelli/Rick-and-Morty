// favorites.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/favorites';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getFavorites() {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  toggleFavorite(episodeId: number) {
    return this.http.post<any>(`${this.apiUrl}/toggle`, { episodeId }, {
      headers: this.getAuthHeaders()
    });
  }

  removeFavorite(episodeId: number) {
  return this.http.delete(`${this.apiUrl}/${episodeId}`, {
      headers: this.getAuthHeaders()
    });
  
}
}
