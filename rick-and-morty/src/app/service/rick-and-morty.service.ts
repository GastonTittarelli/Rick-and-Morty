import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getAllCharacters(page: number, name: string = '') {
    let url = `${this.apiUrl}/character/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }

  getEpisodeByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  getEpisodes(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode?page=${page}`);
  }

  getEpisodeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`);
  }

  getByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }
}
