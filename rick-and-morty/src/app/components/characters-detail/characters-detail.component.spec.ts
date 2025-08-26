import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharactersDetailComponent } from './characters-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatusTranslatePipe } from '../../shared/pipes/status-translate.pipe';
import { GenderTranslatePipe } from '../../shared/pipes/gender-translate.pipe';

// Mock parametrizable
class RickAndMortyServiceMock {
  shouldFail = false;

  getCharacterById(id: number) {
    if (this.shouldFail) return throwError(() => new Error('API error'));
    return of({
      id,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      image: 'rick.png',
      episode: ['url1', 'url2']
    });
  }

  getEpisodeByUrl(url: string) {
    if (this.shouldFail) return throwError(() => new Error('API error'));
    const episodes: Record<string, any> = {
      url1: { id: 1, name: 'Pilot' },
      url2: { id: 2, name: 'Lawnmower Dog' },
    };
    return of(episodes[url] || { id: 99, name: 'Unknown' });
  }
}

describe('CharactersDetailComponent', () => {
  let component: CharactersDetailComponent;
  let fixture: ComponentFixture<CharactersDetailComponent>;
  let routerNavigateSpy: jasmine.Spy;
  let serviceMock: RickAndMortyServiceMock;

  // Helper para generar episodios
  const generateEpisodes = (count: number) => Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `E${i + 1}` }));

  beforeEach(async () => {
    routerNavigateSpy = jasmine.createSpy('navigate');
    serviceMock = new RickAndMortyServiceMock();

    await TestBed.configureTestingModule({
      imports: [CommonModule, CharactersDetailComponent, StatusTranslatePipe, GenderTranslatePipe],
      providers: [
        { provide: RickAndMortyService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: Router, useValue: { navigate: routerNavigateSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersDetailComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse en componente CharactersDetail', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar personaje y episodios correctamente', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.character.name).toBe('Rick Sanchez');
    expect(component.episodes.length).toBe(2);
  }));

  it('debe mostrar todos los episodios si son menos de 21', () => {
    component.episodes = generateEpisodes(5);
    component.showAllEpisodes = false;
    expect(component.visibleEpisodes.length).toBe(5);
    expect(component.shouldShowMore).toBeFalse();
  });

  it('debe mostrar todos los episodios al hacer click en (more)', () => {
    component.episodes = generateEpisodes(30);
    component.showAllEpisodes = true;
    expect(component.visibleEpisodes.length).toBe(30);
    expect(component.shouldShowMore).toBeFalse();
  });

  it('debe retornar la clase correcta para status', () => {
    component.character = { status: 'Alive' } as any;
    expect(component.statusClass).toBe('alive');

    component.character.status = 'Dead';
    expect(component.statusClass).toBe('dead');

    component.character.status = 'unknown';
    expect(component.statusClass).toBe('unknown');

    component.character.status = 'Otro';
    expect(component.statusClass).toBe('');
  });
});

describe('CharactersDetailComponent - casos de error', () => {
  let routerNavigateSpy: jasmine.Spy;
  let fixture: ComponentFixture<CharactersDetailComponent>;
  let serviceMock: RickAndMortyServiceMock;

  beforeEach(async () => {
    routerNavigateSpy = jasmine.createSpy('navigate');
    serviceMock = new RickAndMortyServiceMock();
    serviceMock.shouldFail = true; // Forzamos error

    await TestBed.configureTestingModule({
      imports: [CommonModule, CharactersDetailComponent],
      providers: [
        { provide: RickAndMortyService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: Router, useValue: { navigate: routerNavigateSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersDetailComponent);
  });

  it('debe redirigir a /404 si el id es inválido', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/404']);
  }));

  it('debe redirigir a /404 si el servicio falla', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/404']);
  }));
});
