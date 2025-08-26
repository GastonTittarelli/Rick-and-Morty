import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RickAndMortyService } from '../rick-and-morty.service';
import { provideHttpClient } from '@angular/common/http';

describe('RickAndMortyService', () => {
  let service: RickAndMortyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RickAndMortyService, 
          provideHttpClient(),     
          provideHttpClientTesting(), 
        ],
    });

    service = TestBed.inject(RickAndMortyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('debe obtener todos los personajes con página y sin nombre', () => {
    service.getAllCharacters(1).subscribe();

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush({}); // responde vacío simulado
  });

  it('debe obtener todos los personajes filtrando por nombre', () => {
    service.getAllCharacters(2, 'Rick').subscribe();

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/?page=2&name=Rick');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('debe obtener personaje por id', () => {
    service.getCharacterById(10).subscribe();

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/10');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('debe obtener episodio por id', () => {
    service.getEpisodeById(5).subscribe();

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/5');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('debe obtener episodios con paginación', () => {
    service.getEpisodes(3).subscribe();

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode?page=3');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('debe obtener recurso por url directa', () => {
    const url = 'https://rickandmortyapi.com/api/location/1';
    service.getByUrl(url).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
