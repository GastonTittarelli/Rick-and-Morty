import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EpisodesComponent } from './episodes.component';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { FavoritesService } from '../../service/favorites.service';
import { MessageService } from '../../service/messages.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('EpisodesComponent', () => {
  let component: EpisodesComponent;
  let fixture: ComponentFixture<EpisodesComponent>;
  let mockApiService: any;
  let mockFavoritesService: any;
  let mockRouter: any;
  let mockMessageService: any;

  beforeEach(async () => {
    // Mock de la API para devolver solamente el episodio a probar
    mockApiService = {
      getEpisodes: jasmine.createSpy('getEpisodes').and.returnValue(
        of({
          info: { count: 1 },
          results: [
            { id: 5, name: 'Test', episode: 'S01E05', air_date: '2021-01-01' },
          ],
        })
      ),
    };

    mockFavoritesService = {
      getFavorites: jasmine
        .createSpy('getFavorites')
        .and.returnValue(of([{ episodeId: 1 }])),
      toggleFavorite: jasmine
        .createSpy('toggleFavorite')
        .and.returnValue(of({ message: 'ok' })),
    };

    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockMessageService = {
      showMessageWithTimeout: jasmine.createSpy('showMessageWithTimeout'),
      handleError: jasmine.createSpy('handleError'),
    };

    await TestBed.configureTestingModule({
      imports: [MatIconModule, EpisodesComponent],
      providers: [
        { provide: RickAndMortyService, useValue: mockApiService },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodesComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los episodios al iniciar', () => {
    component.ngOnInit();
    expect(mockApiService.getEpisodes).toHaveBeenCalled();
    expect(component.episodes.length).toBe(1);
    expect(component.displayedEpisodes.length).toBe(1);
  });

  it('debería cargar los episodios favoritos al iniciar', () => {
    component.ngOnInit();
    expect(mockFavoritesService.getFavorites).toHaveBeenCalled();
    expect(component.favoriteEpisodeIds.has(1)).toBeTrue();
  });

  it('debería cortar correctamente displayedEpisodes según la página actual', () => {
    component.currentPage = 2;
    component.episodesPerPage = 10;
    component.episodes = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));

    const start = ((component.currentPage - 1) % 2) * component.episodesPerPage;
    component.displayedEpisodes = component.episodes.slice(
      start,
      start + component.episodesPerPage
    );

    expect(component.displayedEpisodes.length).toBe(10);
    expect(component.displayedEpisodes[0].id).toBe(11);
  });

  it('debería navegar a los detalles del episodio al hacer click en la tarjeta', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.episode-card'));
    card.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['home/episodes', 5]);
  });

  it('debería alternar favorito y mostrar mensaje de éxito', fakeAsync(() => {
    const episode = { id: 2, name: 'Test', episode: 'S01E02' };
    component.toggleFavorite(episode);
    tick();

    expect(mockFavoritesService.toggleFavorite).toHaveBeenCalledWith(2);
    expect(mockMessageService.showMessageWithTimeout).toHaveBeenCalledWith(
      'success',
      'ok'
    );
  }));

  it('debería manejar error al alternar favorito', fakeAsync(() => {
    mockFavoritesService.toggleFavorite.and.returnValue(
      throwError(() => new Error('fail'))
    );
    const episode = { id: 3 };
    component.toggleFavorite(episode);
    tick();

    expect(mockMessageService.handleError).toHaveBeenCalled();
  }));

  it('debería devolver true para episodios favoritos', () => {
    component.favoriteEpisodeIds = new Set([1, 3]);
    expect(component.isFavorite(1)).toBeTrue();
    expect(component.isFavorite(2)).toBeFalse();
  });

  it('debería calcular correctamente el total de páginas', () => {
    component.totalEpisodes = 25;
    component.episodesPerPage = 10;
    expect(component.totalPages).toBe(3);
  });

  it('debería cambiar de página y recargar episodios', () => {
    spyOn(component, 'loadEpisodes');
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.loadEpisodes).toHaveBeenCalled();
  });

  it('no debería navegar al hacer click en el ícono de favorito', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('.favorite-button'));
    icon.triggerEventHandler('click', { stopPropagation: () => {} });

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('debería manejar la respuesta de episodios vacía', () => {
    mockApiService.getEpisodes.and.returnValue(
      of({ info: { count: 0 }, results: [] })
    );

    component.loadEpisodes();

    expect(component.episodes.length).toBe(0);
    expect(component.displayedEpisodes.length).toBe(0);
  });

  it('ngOnInit debería llamar a loadEpisodes y loadFavorites', () => {
    spyOn(component, 'loadEpisodes');
    spyOn(component, 'loadFavorites');

    component.ngOnInit();

    expect(component.loadEpisodes).toHaveBeenCalled();
    expect(component.loadFavorites).toHaveBeenCalled();
  });
});
