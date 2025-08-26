import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FavoriteListComponent } from './favorite-list.component';
import { FavoritesService } from '../../service/favorites.service';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { MessageService } from '../../service/messages.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Character } from '../../shared/interfaces/characters.interface';

describe('FavoriteListComponent', () => {
  let component: FavoriteListComponent;
  let fixture: ComponentFixture<FavoriteListComponent>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;
  let rmService: jasmine.SpyObj<RickAndMortyService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;

  const characterMock: Character = {
    id: 1,
    name: 'Rick',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'img.jpg',
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2020-01-01T00:00:00.000Z',
    episode: ['https://rickandmortyapi.com/api/episode/1']
  };

  const episodeMock = {
    id: 1,
    name: 'Pilot',
    episode: 'S01E01',
    characters: [characterMock.url]
  };

  beforeEach(async () => {
    const favoritesSpy = jasmine.createSpyObj('FavoritesService', ['getFavorites', 'removeFavorite']);
    const rmSpy = jasmine.createSpyObj('RickAndMortyService', ['getEpisodeById', 'getByUrl']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['processResultCode', 'handleError']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatIconModule, FavoriteListComponent],
      providers: [
        { provide: FavoritesService, useValue: favoritesSpy },
        { provide: RickAndMortyService, useValue: rmSpy },
        { provide: MessageService, useValue: msgSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteListComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService) as jasmine.SpyObj<FavoritesService>;
    rmService = TestBed.inject(RickAndMortyService) as jasmine.SpyObj<RickAndMortyService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debe crear el componente FavoriteList', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los favoritos al iniciar', fakeAsync(() => {
    const favMock = [{ id: 1, episodeId: 1 }];

    favoritesService.getFavorites.and.returnValue(of(favMock));
    rmService.getEpisodeById.and.returnValue(of(episodeMock));
    rmService.getByUrl.and.returnValue(of(characterMock));

    component.ngOnInit();
    tick();

    expect(component.favorites.length).toBe(1);
    expect(component.charactersMap[1].length).toBe(1);
    expect(component.charactersMap[1][0].name).toBe('Rick');
  }));

  it('debe navegar al episodio al hacer click', () => {
    component.goToEpisode(42);
    expect(router.navigate).toHaveBeenCalledWith(['home/episodes', 42]);
  });

  it('debe navegar al personaje al hacer click', () => {
    component.goToCharacter(characterMock.url);
    expect(router.navigate).toHaveBeenCalledWith(['home/characters', 1]);
  });

  it('debe devolver null si extractIdFromUrl falla', () => {
    const result = component.extractIdFromUrl('invalid-url');
    expect(result).toBeNull();
  });

  it('debe extraer el ID de una URL de personaje válida', () => {
  const url = 'https://rickandmortyapi.com/api/character/42';
  const id = component.extractIdFromUrl(url);
  expect(id).toBe(42);
});

  it('debe eliminar un favorito correctamente', fakeAsync(() => {
    component.favorites = [episodeMock];
    component.charactersMap = { 1: [characterMock] };

    favoritesService.removeFavorite.and.returnValue(of({ header: { resultCode: 200, message: 'Deleted' } }));

    component.removeFavorite(1);
    tick();

    expect(component.favorites.length).toBe(0);
    expect(component.charactersMap[1]).toBeUndefined();
    expect(messageService.processResultCode).toHaveBeenCalledWith(200, 'Deleted');
  }));

  it('debe manejar errores al eliminar un favorito', fakeAsync(() => {
    favoritesService.removeFavorite.and.returnValue(throwError(() => new Error('fail')));

    component.removeFavorite(1);
    tick();

    expect(messageService.handleError).toHaveBeenCalled();
  }));

  it('debe mostrar el mensaje "No hay favoritos" cuando esté vacío', () => {
    favoritesService.getFavorites.and.returnValue(of([]));
    fixture.detectChanges();

    const noFavElem = fixture.debugElement.query(By.css('.not-favorite p'));
    expect(noFavElem.nativeElement.textContent).toContain('No favorites yet.');
  });

  it('debe llamar a goToEpisode al hacer clic en el nombre del episodio', () => {
  favoritesService.getFavorites.and.returnValue(of([])); 
  spyOn(component, 'goToEpisode');

  component.favorites = [{ id: 1, name: 'Pilot', episode: 'S01E01', characters: [] }];
  fixture.detectChanges();

  const h5 = fixture.debugElement.query(By.css('h5'));
  h5.triggerEventHandler('click', { stopPropagation: () => {} });

  expect(component.goToEpisode).toHaveBeenCalledWith(1);
});

  it('debe llamar a goToCharacter al hacer clic en el personaje', () => {
  favoritesService.getFavorites.and.returnValue(of([]));
  spyOn(component, 'goToCharacter');

  component.favorites = [{ id: 1, name: 'Pilot', episode: 'S01E01', characters: [] }];
  component.charactersMap = {
    1: [characterMock]
  };
  fixture.detectChanges();

  const img = fixture.debugElement.query(By.css('.thumbnail'));
  img.triggerEventHandler('click', { stopPropagation: () => {} });

  expect(component.goToCharacter).toHaveBeenCalledWith(characterMock.url);
});

it('debe extraer el ID de una URL de personaje válida', () => {
  const url = 'https://rickandmortyapi.com/api/character/42';
  const id = component.extractIdFromUrl(url);
  expect(id).toBe(42);
});

//evita navegación accidental
it('no debe navegar al hacer clic en el ícono de eliminar', () => {
  spyOn(component, 'goToEpisode');
  
  favoritesService.getFavorites.and.returnValue(of([]));
  favoritesService.removeFavorite.and.returnValue(of({ header: { resultCode: 200, message: 'Deleted' } }));

  component.favorites = [episodeMock];
  fixture.detectChanges();

  const deleteIcon = fixture.debugElement.query(By.css('.delete-button'));
  deleteIcon.triggerEventHandler('click', { stopPropagation: () => {} });

  expect(component.goToEpisode).not.toHaveBeenCalled();
});

});
