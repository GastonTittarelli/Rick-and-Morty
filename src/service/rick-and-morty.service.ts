import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

// getAllCharacters(page: number = 1): Observable<any> {
//   return this.http.get(`${this.apiUrl}/character?page=${page}`);
// }

getAllCharacters(page: number, name: string = '') {
  let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
  if (name) {
    url += `&name=${name}`;
  }
  return this.http.get(url);
}

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }

  
}
