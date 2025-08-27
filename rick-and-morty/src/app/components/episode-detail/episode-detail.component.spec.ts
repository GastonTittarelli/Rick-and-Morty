import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EpisodeDetailComponent } from './episode-detail.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { FavoritesService } from '../../service/favorites.service';
import { MessageService } from '../../service/messages.service';
import { of, throwError } from 'rxjs';
import { Character } from '../../shared/interfaces/characters.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommentsComponent } from '../comments/comments.component';
import { CommentsService } from '../../service/comments.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('EpisodeDetailComponent', () => {
  let component: EpisodeDetailComponent;
  let fixture: ComponentFixture<EpisodeDetailComponent>;
  let mockActivatedRoute: any;
  let mockRickAndMortyService: jasmine.SpyObj<RickAndMortyService>;
  let mockFavoritesService: jasmine.SpyObj<FavoritesService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockCommentsService: jasmine.SpyObj<CommentsService>;

  const mockEpisode = {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ],
  };

  const mockCharacters: Character[] = [
    { id: 1, name: 'Rick Sanchez' } as Character,
    { id: 2, name: 'Morty Smith' } as Character,
  ];

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    };

    mockRickAndMortyService = jasmine.createSpyObj('RickAndMortyService', [
      'getEpisodeById',
      'getByUrl',
    ]);
    mockFavoritesService = jasmine.createSpyObj('FavoritesService', [
      'toggleFavorite',
      'getFavorites',
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', [
      'showMessageWithTimeout',
      'handleError',
    ]);
    mockCommentsService = jasmine.createSpyObj('CommentsService', [
      'getComments',
      'addComment',
      'getCommentsByEpisode',
      'isCommentingDisabled',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, RouterLink, CommentsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RickAndMortyService, useValue: mockRickAndMortyService },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: CommentsService, useValue: mockCommentsService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodeDetailComponent);
    component = fixture.componentInstance;

    // Mock service responses
    mockRickAndMortyService.getEpisodeById.and.returnValue(of(mockEpisode));
    mockRickAndMortyService.getByUrl
      .withArgs('https://rickandmortyapi.com/api/character/1')
      .and.returnValue(of(mockCharacters[0]));
    mockRickAndMortyService.getByUrl
      .withArgs('https://rickandmortyapi.com/api/character/2')
      .and.returnValue(of(mockCharacters[1]));
    mockFavoritesService.getFavorites.and.returnValue(of([{ episodeId: 1 }]));
    mockFavoritesService.toggleFavorite.and.returnValue(
      of({ message: 'Favorito actualizado' })
    );
    mockCommentsService.getCommentsByEpisode.and.returnValue(of([]));
    mockCommentsService.isCommentingDisabled.and.returnValue(of(false)); // Mock this method
  });

  it('debe crearse el componente EpisodeDetail', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con los datos del episodio y los personajes', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.episode).toEqual(mockEpisode);
    expect(component.characters).toEqual(mockCharacters);
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockRickAndMortyService.getEpisodeById).toHaveBeenCalledWith(1);
    expect(mockRickAndMortyService.getByUrl).toHaveBeenCalledTimes(2);
  }));

  it('debe verificar si el episodio es favorito al inicializarse', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockFavoritesService.getFavorites).toHaveBeenCalled();
    expect(component.isFavorite).toBeTrue();
  }));

  it('debe alternar el estado de favorito', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.toggleFavorite();
    tick();

    expect(mockFavoritesService.toggleFavorite).toHaveBeenCalledWith(1);
    expect(mockFavoritesService.getFavorites).toHaveBeenCalledTimes(2);
    expect(mockMessageService.showMessageWithTimeout).toHaveBeenCalledWith(
      'success',
      'Favorito actualizado'
    );
  }));

  it('debe manejar el error al alternar el estado de favorito', fakeAsync(() => {
    const error = new Error('No se pudo cambiar el estado de favorito');
    mockFavoritesService.toggleFavorite.and.returnValue(
      throwError(() => error)
    );

    fixture.detectChanges();
    tick();

    component.toggleFavorite();
    tick();

    expect(mockMessageService.handleError).toHaveBeenCalledWith(error);
  }));

  it('debe manejar cuando falta el ID del episodio en la ruta', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    fixture.detectChanges();

    expect(mockRickAndMortyService.getEpisodeById).not.toHaveBeenCalled();
  });

  it('debe mostrar los detalles del episodio en la plantilla', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.episode-title').textContent).toContain(
      mockEpisode.name
    );
    expect(
      compiled.querySelector('[data-testid="episode-air-date"]').textContent
    ).toContain(mockEpisode.air_date);
    expect(
      compiled.querySelector('[data-testid="episode-code"]').textContent
    ).toContain(mockEpisode.episode);
  })); // data-testid agregado para que sea mas amigable y entendible en elementos que no tienen clases designadas

  it('debe mostrar los personajes en la plantilla', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const characterLinks = compiled.querySelectorAll('.characters-list a');
    expect(characterLinks.length).toBe(2);
    expect(characterLinks[0].textContent).toContain('Rick Sanchez');
    expect(characterLinks[1].textContent).toContain('Morty Smith');
  }));

  it('debe actualizar el ícono de favorito según el estado', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('favorite');
    expect(icon.classList.contains('favorited')).toBeTrue();

    // Simula el quitar de favoritos
    component.isFavorite = false;
    fixture.detectChanges();
    icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.textContent.trim()).toBe('favorite_border');
    expect(icon.classList.contains('favorited')).toBeFalse();
  }));

  it('debe pasar el episodeId al componente de comentarios', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const commentsComponent = fixture.debugElement.query(
      (el) => el.componentInstance instanceof CommentsComponent
    );
    expect(commentsComponent).toBeTruthy();
    expect(commentsComponent.componentInstance.episodeId).toBe(1);

    // Verifica que el servicio de comentarios fue llamado
    expect(mockCommentsService.getCommentsByEpisode).toHaveBeenCalledWith(1);
  }));

  it('debe llamar a toggleFavorite al hacer clic en el ícono de favorito', fakeAsync(() => {
    spyOn(component, 'toggleFavorite').and.callThrough();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('mat-icon');
    icon.click(); // Simula click en el ícono

    tick();

    expect(component.toggleFavorite).toHaveBeenCalled();
    expect(mockFavoritesService.toggleFavorite).toHaveBeenCalledWith(1);
  }));

  it('debe usar el mensaje por defecto si no hay mensaje en la respuesta de toggleFavorite', fakeAsync(() => {
    mockFavoritesService.toggleFavorite.and.returnValue(of({})); // Sin message

    fixture.detectChanges();
    tick();

    component.toggleFavorite();
    tick();

    expect(mockMessageService.showMessageWithTimeout).toHaveBeenCalledWith(
      'success',
      'Favorite list updated'
    );
  }));
});
