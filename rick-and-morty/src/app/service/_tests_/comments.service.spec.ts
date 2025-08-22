import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
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
          provideHttpClientTesting()
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get comments by episode with correct headers', () => {
    const episodeId = 1;
    const mockComments = [{ id: '1', content: 'Test', episodeId, createdAt: 'now', user: { id: 'u1', name: 'User1' } }];

    service.getCommentsByEpisode(episodeId).subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(mockComments);
  });

  it('should create a comment with correct headers', () => {
    const episodeId = 1;
    const content = 'New comment';
    const mockResponse = { id: '1', content, episodeId, createdAt: 'now', user: { id: 'u1', name: 'User1' } };

    service.createComment(episodeId, content).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual({ episodeId, content });
    req.flush(mockResponse);
  });

  it('should update a comment with correct headers', () => {
    const id = '1';
    const content = 'Updated comment';
    const mockResponse = { id, content, episodeId: 1, createdAt: 'now', user: { id: 'u1', name: 'User1' } };

    service.updateComment(id, content).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual({ content });
    req.flush(mockResponse);
  });

  it('should delete a comment with correct headers', () => {
    const id = '1';
    const mockResponse = { message: 'Deleted' };

    service.deleteComment(id).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(mockResponse);
  });

  it('should check if commenting is disabled', () => {
    const episodeId = 1;

    service.isCommentingDisabled(episodeId).subscribe(res => {
      expect(res).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}/disabled`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should disable comments', () => {
    const episodeId = 1;

    service.disableComments(episodeId).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}/disable-comments`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush({});
  });

  it('should enable comments', () => {
    const episodeId = 1;

    service.enableComments(episodeId).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}/episode/${episodeId}/enable-comments`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush({});
  });
});
