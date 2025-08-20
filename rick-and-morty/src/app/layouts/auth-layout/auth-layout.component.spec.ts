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

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Template structure', () => {
    it('debería renderizar en la vista los enlaces "Rick & Morty" y "Log as Guest', () => {
      const navElement =
        fixture.debugElement.nativeElement.querySelector('nav');
      expect(navElement).toBeTruthy();

      const links = navElement.querySelectorAll('a');
      expect(links.length).toBe(2);
      expect(links[0].textContent).toContain('Rick & Morty');
      expect(links[1].textContent).toContain('Log as Guest');
    });

    it('debería renderizar el router outlet', () => {
      const routerOutlet =
        fixture.debugElement.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('debería renderizar el componente Footer', () => {
      const footer =
        fixture.debugElement.nativeElement.querySelector('app-footer');
      expect(footer).toBeTruthy();
    });

    it('debería tener un elemento de contenido principal', () => {
      const mainElement =
        fixture.debugElement.nativeElement.querySelector('main.authContent');
      expect(mainElement).toBeTruthy();
    });
  });

  describe('prepareRoute method', () => {
    it('debería devolver la animación correcta del outlet', () => {
      const mockOutlet = createMockOutlet('slideIn');
      const result = component.prepareRoute(mockOutlet);
      expect(result).toBe('slideIn');
    });

    it('debería devolver null cuando activatedRouteData es null (no tiene datos)', () => {
      const mockOutlet = createMockOutlet();
      (mockOutlet as any).activatedRouteData = null;

      const result = component.prepareRoute(mockOutlet);

      expect(result).toBeNull();
    });

    it('debería devolver undefined cuando no existe la propiedad de animación', () => {
      const mockOutlet = createMockOutlet();
      const result = component.prepareRoute(mockOutlet);
      expect(result).toBeUndefined(); 
    });

    it('debería devolver null cuando el outlet es null', () => {
      const result = component.prepareRoute(null as any);
      expect(result).toBeNull();
    });

    it('debería manejar valores inesperados de activatedRouteData de manera adecuada', () => {
      const mockOutlet = createMockOutlet() as any;
      mockOutlet.activatedRouteData = { animation: 123 }; // valor inesperado

      const result = component.prepareRoute(mockOutlet);
      expect(result).toBe(123);
    });
  });

  describe('CSS classes', () => {
    it('debería tener la clase authLayout en el contenedor principal', () => {
      const container =
        fixture.debugElement.nativeElement.querySelector('.authLayout');
      expect(container).toBeTruthy();
    });

    it('debería tener la clase authContent en el elemento principal', () => {
      const mainElement =
        fixture.debugElement.nativeElement.querySelector('.authContent');
      expect(mainElement).toBeTruthy();
    });
  });
});
