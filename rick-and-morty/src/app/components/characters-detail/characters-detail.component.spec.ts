import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharactersDetailComponent } from './characters-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatusTranslatePipe } from '../../shared/pipes/status-translate.pipe';
import { GenderTranslatePipe } from '../../shared/pipes/gender-translate.pipe';

class RickAndMortyServiceMock {
  getCharacterById(id: number) {
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
    if (url === 'url1') return of({ id: 1, name: 'Pilot' });
    if (url === 'url2') return of({ id: 2, name: 'Lawnmower Dog' });
    return of({ id: 99, name: 'Unknown' });
  }
}

class RickAndMortyServiceErrorMock {
  getCharacterById(id: number) {
    return throwError(() => new Error('API error'));
  }
  getEpisodeByUrl(url: string) {
    return throwError(() => new Error('API error'));
  }
}

describe('CharactersDetailComponent', () => {
  let component: CharactersDetailComponent;
  let fixture: ComponentFixture<CharactersDetailComponent>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
  routerNavigateSpy = jasmine.createSpy('navigate');

  await TestBed.configureTestingModule({
    imports: [CommonModule, CharactersDetailComponent, StatusTranslatePipe, GenderTranslatePipe],
    providers: [
      { provide: RickAndMortyService, useClass: RickAndMortyServiceMock },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
      { provide: Router, useValue: { navigate: routerNavigateSpy } }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(CharactersDetailComponent);
  component = fixture.componentInstance;
});

  it('debería crearse', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('debería cargar personaje y episodios correctamente', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.character.name).toBe('Rick Sanchez');
    expect(component.episodes.length).toBe(2);
  }));

  it('debería mostrar todos los episodios si son menos de 21', () => {
  const fewEpisodes = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `E${i + 1}` }));
  component.episodes = fewEpisodes;
  component.showAllEpisodes = false;
  expect(component.visibleEpisodes.length).toBe(5);
  expect(component.shouldShowMore).toBeFalse();
});

  it('debería mostrar todos los episodios al hacer click en (more)', () => {
    const manyEpisodes = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `E${i + 1}` }));
    component.episodes = manyEpisodes;
    component.showAllEpisodes = true;
    expect(component.visibleEpisodes.length).toBe(30);
    expect(component.shouldShowMore).toBeFalse();
  });

  it('debería retornar la clase correcta para status', () => {
  component.character = { status: 'Alive' };
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

  beforeEach(async () => {
    routerNavigateSpy = jasmine.createSpy('navigate');

    await TestBed.configureTestingModule({
      imports: [CommonModule, CharactersDetailComponent],
      providers: [
        { provide: RickAndMortyService, useValue: {} }, // servicio no importa
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', 'abc']]) } } },
        { provide: Router, useValue: { navigate: routerNavigateSpy } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersDetailComponent);
  });

  it('debería redirigir a /404 si el id es inválido', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // deja que se ejecute redirect
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/404']);
  }));

  it('debería redirigir a /404 si el servicio falla', fakeAsync(() => {
    // Reconfiguramos TestBed en un describe separado para usar el mock de error
    const routerSpy = jasmine.createSpy('navigate');

    TestBed.resetTestingModule(); // resetea el módulo anterior
    TestBed.configureTestingModule({
      imports: [CommonModule, CharactersDetailComponent],
      providers: [
        { 
          provide: RickAndMortyService, 
          useValue: {
            getCharacterById: () => throwError(() => new Error('API error')),
            getEpisodeByUrl: () => throwError(() => new Error('API error'))
          } 
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id', '1']]) } } },
        { provide: Router, useValue: { navigate: routerSpy } }
      ]
    }).compileComponents();

    const fixture2 = TestBed.createComponent(CharactersDetailComponent);
    fixture2.detectChanges();
    tick();

    expect(routerSpy).toHaveBeenCalledWith(['/404']);
  }));
});

  
