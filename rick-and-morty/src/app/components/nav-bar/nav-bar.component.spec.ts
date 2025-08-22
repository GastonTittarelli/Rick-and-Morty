import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import {
  Router,
  RouterModule,
  Event,
  ActivatedRoute,
  provideRouter,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/users.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockAuthService {
  logout = jasmine.createSpy('logout');
}

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, NavBarComponent],
      providers: [
        provideRouter([]), // Router real de pruebas
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe crear el componente NavComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleMenu', () => {
    it('debe abrir y cerrar el menú', () => {
      expect(component.menuOpen).toBeFalse();
      component.toggleMenu();
      expect(component.menuOpen).toBeTrue();
      component.toggleMenu();
      expect(component.menuOpen).toBeFalse();
    });
  });

  describe('closeMenu', () => {
    it('debe cerrar el menú y resetear disableTransition después de un tiempo', fakeAsync(() => {
      component.menuOpen = true;
      component.disableTransition = false;

      component.closeMenu();
      expect(component.menuOpen).toBeFalse();
      expect(component.disableTransition).toBeTrue();

      tick(); // simula el setTimeout
      expect(component.disableTransition).toBeFalse();
    }));
  });

  describe('onClickOutside', () => {
    it('debe cerrar el menú si se hace click fuera', () => {
      component.menuOpen = true;
      const fakeEvent = {
        target: document.createElement('div'),
      } as unknown as MouseEvent;

      spyOn(component, 'closeMenu');
      component.onClickOutside(fakeEvent);
      expect(component.closeMenu).toHaveBeenCalled();
    });

    it('no deber cerrarse si el click es dentro del componente', () => {
      component.menuOpen = true;
      const fakeEvent = {
        target: fixture.nativeElement, // simula click dentro
      } as unknown as MouseEvent;

      spyOn(component, 'closeMenu');
      component.onClickOutside(fakeEvent);
      expect(component.closeMenu).not.toHaveBeenCalled();
    });
  });

  describe('setUserName', () => {
    it('debe asignar el nombre desde localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Rick' }));
      component['setUserName']();
      expect(component.userName).toBe('Rick');
    });

    it('debe asignar el nombre desde sessionStorage si no está en localStorage', () => {
      sessionStorage.setItem('user', JSON.stringify({ name: 'Morty' }));
      component['setUserName']();
      expect(component.userName).toBe('Morty');
    });

    it('debe asignar null si no hay user', () => {
      component['setUserName']();
      expect(component.userName).toBeNull();
    });

    it('debe asignar null si el JSON está malformado', () => {
      // El spy del console.error:
      // 1) Evitar que el mensaje de error aparezca en el log durante la prueba (lo captura).
      // 2) Verificar que el componente maneja correctamente el error de parseo.
      spyOn(console, 'error');

      localStorage.setItem('user', '{ bad json }');
      component['setUserName']();

      expect(component.userName).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error al parsear user del localStorage',
        jasmine.any(Error)
      );
    });
  });

  describe('logout', () => {
    it('debe llamar al logout, cerrar el menú y navegar a login', () => {
      spyOn(component, 'closeMenu');
      spyOn(router, 'navigate'); // espio al router real

      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(component.closeMenu).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('logout funciona aunque menuOpen sea false', () => {
      component.menuOpen = false;
      spyOn(component, 'closeMenu').and.callThrough();
      spyOn(router, 'navigate');

      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(component.closeMenu).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('router.events', () => {
    it('debe actualizar el userName cuando hay un cambio de ruta', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Summer' }));

      // El router real emite eventos cuando se navega, así que en test podés forzar manualmente
      (router.events as any).next?.({} as Event);

      expect(component.userName).toBe('Summer');
    });
  });

  describe('template', () => {
    it('debe renderizar el userName en el HTML', () => {
      component.userName = 'Beth';
      fixture.detectChanges();
      const userNameEl = fixture.debugElement.query(By.css('.user-name span'))
        .nativeElement as HTMLElement;
      expect(userNameEl.textContent).toContain('Beth');
    });
  });

  it('debe mostrar el span del userName vacío si es null', () => {
    component.userName = null;
    fixture.detectChanges();
    const userNameEl = fixture.debugElement.query(By.css('.user-name span'))
      .nativeElement as HTMLElement;
    expect(userNameEl.textContent?.trim()).toBe('');
  });
});
