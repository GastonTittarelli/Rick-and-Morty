import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

// Mock simplificado para pruebas
const createMockOutlet = (animation?: string) => {
  return {
    activatedRouteData: animation ? { animation } : {},
  } as unknown as RouterOutlet;
};

describe('AuthLayoutComponent', () => {
  let component: AuthLayoutComponent;
  let fixture: ComponentFixture<AuthLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, AuthLayoutComponent, FooterComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente auth-layout', () => {
    expect(component).toBeTruthy();
  });

  describe('Template structure', () => {
    it('debe renderizar en la vista los enlaces "Rick & Morty" y "Log as Guest', () => {
      const navElement =
        fixture.debugElement.nativeElement.querySelector('nav');
      expect(navElement).toBeTruthy();

      const links = navElement.querySelectorAll('a');
      expect(links.length).toBe(2);
      expect(links[0].textContent).toContain('Rick & Morty');
      expect(links[1].textContent).toContain('Log as Guest');
    });

    it('debe renderizar el router outlet', () => {
      const routerOutlet =
        fixture.debugElement.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('debe renderizar el componente Footer', () => {
      const footer =
        fixture.debugElement.nativeElement.querySelector('app-footer');
      expect(footer).toBeTruthy();
    });

    it('debe tener un elemento de contenido principal', () => {
      const mainElement =
        fixture.debugElement.nativeElement.querySelector('main.authContent');
      expect(mainElement).toBeTruthy();
    });
  });

  describe('prepareRoute method', () => {
    it('debe devolver la animación correcta del outlet', () => {
      const mockOutlet = createMockOutlet('slideIn');
      const result = component.prepareRoute(mockOutlet);
      expect(result).toBe('slideIn');
    });

    it('debe devolver null cuando activatedRouteData es null (no tiene datos)', () => {
      const mockOutlet = createMockOutlet();
      (mockOutlet as any).activatedRouteData = null;

      const result = component.prepareRoute(mockOutlet);

      // La función devuelve null, porque no hay nada que mostrar.
      expect(result).toBeNull();
    });

    it('debe devolver undefined cuando no existe la propiedad de animación', () => {
      const mockOutlet = createMockOutlet();
      const result = component.prepareRoute(mockOutlet);
      // La función devuelve undefined porque la animación no está definida
      expect(result).toBeUndefined(); 
    });

    it('debe devolver null cuando el outlet es null', () => {
      const result = component.prepareRoute(null as any);
      // La función devuelve null porque no hay objeto para revisar.
      expect(result).toBeNull();
    });

    it('debe manejar valores inesperados de activatedRouteData de manera adecuada', () => {
      const mockOutlet = createMockOutlet() as any;
      mockOutlet.activatedRouteData = { animation: 123 }; // cualquier valor

      const result = component.prepareRoute(mockOutlet);
      // La función devuelve exactamente lo que encuentra.
      expect(result).toBe(123);
    });
  });

  describe('CSS classes', () => {
    it('debe tener la clase authLayout en el contenedor principal', () => {
      const container =
        fixture.debugElement.nativeElement.querySelector('.authLayout');
      expect(container).toBeTruthy();
    });
  });
});
