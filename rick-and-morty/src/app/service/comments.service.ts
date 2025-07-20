import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CommentResponse {
  id: string;
  content: string;
  episodeId: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  // private baseUrl = 'http://localhost:3000/comments';
  private baseUrl = 'https://rick-and-morty-qxca.onrender.com/comments'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getCommentsByEpisode(episodeId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.baseUrl}/episode/${episodeId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createComment(episodeId: number, content: string): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(
      this.baseUrl,
      { episodeId, content },
      { headers: this.getAuthHeaders() }
    );
  }

  updateComment(id: string, content: string): Observable<CommentResponse> {
  return this.http.patch<CommentResponse>(
    `${this.baseUrl}/${id}`,
    { content },
    { headers: this.getAuthHeaders() }
  );
}

deleteComment(id: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
    headers: this.getAuthHeaders(),
  });
}


isCommentingDisabled(episodeId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/episode/${episodeId}/disabled`);
}

disableComments(episodeId: number): Observable<any> {
  return this.http.patch(`${this.baseUrl}/episode/${episodeId}/disable-comments`, {}, {
    headers: this.getAuthHeaders()
  });
}

enableComments(episodeId: number): Observable<any> {
  return this.http.patch(`${this.baseUrl}/episode/${episodeId}/enable-comments`, {}, {
    headers: this.getAuthHeaders()
  });
}
}
