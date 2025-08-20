import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbNavComponent } from './breadcrumb-nav.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { Subject, of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';


const routerMock = {
  url: '/home/characters/1',
  events: new Subject<any>().asObservable(),
  navigate: jasmine.createSpy('navigate'),
  createUrlTree: jasmine.createSpy('createUrlTree').and.callFake((commands: any) => commands),
  serializeUrl: jasmine.createSpy('serializeUrl').and.callFake((url: any) => url)
};


// Mock del servicio normal
class RickAndMortyServiceMock {
  getCharacterById(id: number) {
    return of({ id, name: 'Rick Sanchez' });
  }
  getEpisodeById(id: number) {
    return of({ id, name: 'Pilot' });
  }
}

// Mock del servicio que falla
class RickAndMortyServiceErrorMock {
  getCharacterById(id: number) {
    return throwError(() => new Error('API fallida'));
  }
  getEpisodeById(id: number) {
    return throwError(() => new Error('API fallida'));
  }
}

describe('BreadcrumbNavComponent', () => {
  let component: BreadcrumbNavComponent;
  let fixture: ComponentFixture<BreadcrumbNavComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, BreadcrumbNavComponent],
      providers: [
        { provide: RickAndMortyService, useClass: RickAndMortyServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbNavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería generar el breadcrumb básico con "Home"', async () => {
    (router as any).url = '/home';
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    expect(component.breadcrumbs[0].label).toBe('Home');
    expect(component.breadcrumbs[0].url).toBe('/home/characters');
  });

  it('debería obtener el nombre del personaje si el segmento anterior es "characters"', async () => {
    (router as any).url = '/home/characters/1';
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    const last = component.breadcrumbs[component.breadcrumbs.length - 1];
    expect(last.label).toBe('Rick Sanchez');
  });

  it('debería obtener el nombre del episodio si el segmento anterior es "episodes"', async () => {
    (router as any).url = '/home/episodes/10';
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    const last = component.breadcrumbs[component.breadcrumbs.length - 1];
    expect(last.label).toContain('Episode 10 - Pilot');
  });

  it('debería renderizar correctamente los breadcrumbs en el HTML', async () => {
    (router as any).url = '/home/characters/1';
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('li.breadcrumb-item');

    expect(items.length).toBe(component.breadcrumbs.length);
    expect(items[items.length - 1].classList.contains('active')).toBeTrue();
  });
});

// Bloque independiente para el test con servicio que falla
describe('BreadcrumbNavComponent - servicio que falla', () => {
  let component: BreadcrumbNavComponent;
  let fixture: ComponentFixture<BreadcrumbNavComponent>;
  let routerMockError: any;

  beforeEach(async () => {
    routerMockError = {
      url: '/home/characters/999',
      events: new Subject<any>().asObservable(),
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.callFake((commands: any) => commands),
      serializeUrl: jasmine.createSpy('serializeUrl').and.callFake((url: any) => url)
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, BreadcrumbNavComponent],
      providers: [
        { provide: RickAndMortyService, useClass: RickAndMortyServiceErrorMock },
        { provide: Router, useValue: routerMockError },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbNavComponent);
    component = fixture.componentInstance;

    // El spyOn para que no aparezcan los logs en el inspector del karma (limpieza de consola)
    spyOn(console, 'error');

    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();
  });

  it('debería manejar errores del servicio sin romper el breadcrumb', () => {
    expect(component.breadcrumbs.length).toBeGreaterThan(0);
    const last = component.breadcrumbs[component.breadcrumbs.length - 1];
    expect(last.label).toBe('999'); // fallback: usa el ID
  });
});


// Bloque de tests extra para BreadcrumbNavComponent
describe('BreadcrumbNavComponent - casos extra', () => {

  it('debería capitalizar correctamente segmentos de texto', async () => {
    const routerMock = {
      url: '/home/locations/earth',
      events: new Subject<any>().asObservable(),
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.callFake((commands: any) => commands),
      serializeUrl: jasmine.createSpy('serializeUrl').and.callFake((url: any) => url)
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CommonModule, BreadcrumbNavComponent],
      providers: [
        { provide: RickAndMortyService, useClass: RickAndMortyServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(BreadcrumbNavComponent);
    const component = fixture.componentInstance;
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    const last = component.breadcrumbs[component.breadcrumbs.length - 1];
    expect(last.label).toBe('Earth'); // capitalizado correctamente
  });

  it('debería generar breadcrumb correcto para un episodio', async () => {
    const routerMock = {
      url: '/home/episodes/15',
      events: new Subject<any>().asObservable(),
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.callFake((commands: any) => commands),
      serializeUrl: jasmine.createSpy('serializeUrl').and.callFake((url: any) => url)
    };

    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CommonModule, BreadcrumbNavComponent],
      providers: [
        { provide: RickAndMortyService, useClass: RickAndMortyServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(BreadcrumbNavComponent);
    const component = fixture.componentInstance;
    await (component as any).buildBreadcrumbs();
    fixture.detectChanges();

    const last = component.breadcrumbs[component.breadcrumbs.length - 1];
    expect(last.label).toContain('Episode 15');
  });

});
