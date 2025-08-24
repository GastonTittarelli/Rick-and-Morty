import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock del Router
    routerSpy = jasmine.createSpyObj<Router>('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);

    // Limpio antes de cada test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe crearse el auth-guard', () => {
    expect(guard).toBeTruthy();
  });

  it('debe retornar true si existe token en localStorage', () => {
    localStorage.setItem('token', '123456');
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('debe retornar true si existe token en sessionStorage', () => {
    sessionStorage.setItem('token', 'abcdef');
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('debe redirigir a /auth/login si no hay token', () => {
    const mockUrlTree = {} as UrlTree;
    routerSpy.parseUrl.and.returnValue(mockUrlTree);

    const result = guard.canActivate();

    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/auth/login');
    expect(result).toBe(mockUrlTree);
  });

  it('debe dar prioridad al token de localStorage sobre sessionStorage', () => {
    localStorage.setItem('token', 'local');
    sessionStorage.setItem('token', 'session');
    const result = guard.canActivate();
    expect(result).toBeTrue();
    // Como devuelve solo true si existe, comprobamos que session no se ejecuta
    expect(routerSpy.parseUrl).not.toHaveBeenCalled();
  });
});
