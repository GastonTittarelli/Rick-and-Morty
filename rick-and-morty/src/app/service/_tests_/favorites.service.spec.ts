import { TestBed } from '@angular/core/testing';
import { FavoritesService } from '../favorites.service';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;
  const dummyToken = 'dummy-token';

  beforeEach(() => {
    localStorage.setItem('token', dummyToken);

    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get favorites with correct headers', () => {
    const mockFavorites = [{ episodeId: 1 }];
    const url = (service as any)['apiUrl'];

    service.getFavorites().subscribe(res => {
      expect(res).toEqual(mockFavorites);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(mockFavorites);
  });

  it('should toggle favorite with correct headers and body', () => {
    const episodeId = 1;
    const mockResponse = { episodeId };
    const url = (service as any)['apiUrl'];

    service.toggleFavorite(episodeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${url}/toggle`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual({ episodeId });
    req.flush(mockResponse);
  });

  it('should remove favorite with correct headers', () => {
    const episodeId = 1;
    const url = (service as any)['apiUrl'];

    service.removeFavorite(episodeId).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${url}/${episodeId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush({});
  });
});
