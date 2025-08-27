import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommentsService } from '../comments.service';
import { provideHttpClient } from '@angular/common/http';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;

  const dummyToken = 'dummy-token';
  const baseUrl = 'https://rick-and-morty-qxca.onrender.com/comments';

  beforeEach(() => {
    localStorage.setItem('token', dummyToken);

    TestBed.configureTestingModule({
      providers: [
        CommentsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe crearse el servicio de comments', () => {
    expect(service).toBeTruthy();
  });

  it('dado un episodio con un token válido, cuando se solicitan los comentarios, entonces se deben obtener los comentarios con el header Authorization correcto', () => {
    const episodeId = 1;
    const mockComments = [
      {
        id: '1',
        content: 'Test',
        episodeId,
        createdAt: 'now',
        user: { id: 'u1', name: 'User1' },
      },
    ];

    service.getCommentsByEpisode(episodeId).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    req.flush(mockComments);
  });

  it('dado un episodio y un contenido con un token válido, cuando se crea un comentario, entonces se debe enviar la petición POST con los datos y headers correctos y devolver el comentario creado.', () => {
    const episodeId = 1;
    const content = 'New comment';
    const mockResponse = {
      id: '1',
      content,
      episodeId,
      createdAt: 'now',
      user: { id: 'u1', name: 'User1' },
    };

    service.createComment(episodeId, content).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    expect(req.request.body).toEqual({ episodeId, content });
    req.flush(mockResponse);
  });

  it('dado un comentario existente con un token válido, cuando se actualiza su contenido, entonces se debe enviar la petición PATCH con los datos y headers correctos y devolver el comentario actualizado.', () => {
    const id = '1';
    const content = 'Updated comment';
    const mockResponse = {
      id,
      content,
      episodeId: 1,
      createdAt: 'now',
      user: { id: 'u1', name: 'User1' },
    };

    service.updateComment(id, content).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    expect(req.request.body).toEqual({ content });
    req.flush(mockResponse);
  });

  it('dado un comentario existente con un token válido, cuando se elimina, entonces se debe enviar la petición DELETE con el header correcto y devolver el mensaje de confirmación.', () => {
    const id = '1';
    const mockResponse = { message: 'Deleted' };

    service.deleteComment(id).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    req.flush(mockResponse);
  });

  it('dado un episodio, cuando se consulta si los comentarios están deshabilitados, entonces se debe devolver la respuesta correspondiente (true/false).', () => {
    const episodeId = 1;

    service.isCommentingDisabled(episodeId).subscribe((res) => {
      expect(res).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}/disabled`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('dado un episodio con un token válido, cuando se deshabilitan los comentarios, entonces se debe enviar la petición PATCH con el header correcto y devolver una respuesta vacía.', () => {
    const episodeId = 1;

    service.disableComments(episodeId).subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(
      `${baseUrl}/episode/${episodeId}/disable-comments`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    req.flush({});
  });

  it('dado un episodio con un token válido, cuando se habilitan los comentarios, entonces se debe enviar la petición PATCH con el header correcto y devolver una respuesta vacía', () => {
    const episodeId = 1;

    service.enableComments(episodeId).subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(
      `${baseUrl}/episode/${episodeId}/enable-comments`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${dummyToken}`
    );
    req.flush({});
  });

  it('dado que localStorage no tiene token y sessionStorage sí, cuando se solicitan los comentarios, entonces se debe usar el token de sessionStorage en el header Authorization', () => {
    localStorage.clear();
    const sessionToken = 'session-token';
    sessionStorage.setItem('token', sessionToken);

    const episodeId = 1;
    const mockComments = [
      {
        id: '1',
        content: 'Test',
        episodeId,
        createdAt: 'now',
        user: { id: 'u1', name: 'User1' },
      },
    ];

    service.getCommentsByEpisode(episodeId).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${sessionToken}`
    );
    req.flush(mockComments);
  });
});
