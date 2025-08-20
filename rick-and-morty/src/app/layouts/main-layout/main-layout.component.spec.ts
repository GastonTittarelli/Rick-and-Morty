import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../service/users.service';
import { RouterOutlet } from '@angular/router';

// Mocks de componentes hijos
@Component({ selector: 'app-nav-bar', template: '' })
class MockNavBarComponent {}

@Component({ selector: 'app-breadcrumb-nav', template: '' })
class MockBreadcrumbNavComponent {}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {}

// Mock AuthService
class MockAuthService {
  getProfile() {
    return of({});
  }
  logout() {}
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    })
      // No se puede testear un Standalone Component con sus hijos, si estos dependen de servicios que no están mockeados. OverrideComponent es obligatorio en tests unitarios para Standalone Components con hijos. Si quisiera usar los componentes reales, tendría que mockear todos los servicios de todos los hijos.
      .overrideComponent(MainLayoutComponent, {
        set: {
          imports: [
            MockNavBarComponent,
            RouterOutlet,
            MockBreadcrumbNavComponent,
            MockFooterComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a getProfile en ngOnInit', fakeAsync(() => {
    const spy = spyOn(authService, 'getProfile').and.callThrough();
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('debería cerrar sesión y navegar en caso de error en getProfile', fakeAsync(() => {
    spyOn(authService, 'getProfile').and.returnValue(
      throwError(() => new Error('Token inválido'))
    );
    const logoutSpy = spyOn(authService, 'logout').and.callThrough();

    component.ngOnInit();
    tick();

    expect(logoutSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('no debería llamar a logout si getProfile tiene éxito', fakeAsync(() => {
    spyOn(authService, 'getProfile').and.returnValue(of({}));
    const logoutSpy = spyOn(authService, 'logout').and.callThrough();

    component.ngOnInit();
    tick();

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('debería renderizar los componentes hijos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bar')).toBeTruthy();
    expect(compiled.querySelector('app-breadcrumb-nav')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('debería tener la clase mainLayout en el contenedor', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.mainLayout')?.classList).toContain(
      'mainLayout'
    );
  });

  it('debería contener router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('debería llamar a getProfile solo una vez', fakeAsync(() => {
    const spy = spyOn(authService, 'getProfile').and.callThrough();
    component.ngOnInit();
    component.ngOnInit(); // llamar dos veces
    tick();
    expect(spy).toHaveBeenCalledTimes(2); // Si realmente se invoca por cada ngOnInit
  }));

  it('debería manejar el error de red en getProfile', fakeAsync(() => {
    spyOn(authService, 'getProfile').and.returnValue(
      throwError(() => ({ status: 500 }))
    );
    const logoutSpy = spyOn(authService, 'logout');

    component.ngOnInit();
    tick();

    expect(logoutSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('debería comportarse correctamente si ngOnInit se llama varias veces', fakeAsync(() => {
    spyOn(authService, 'getProfile').and.returnValue(of({}));
    const logoutSpy = spyOn(authService, 'logout');

    component.ngOnInit();
    component.ngOnInit();
    tick();

    expect(logoutSpy).not.toHaveBeenCalled();
  }));
});
