import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PublicGuard } from './not-auth.guard';

describe('PublicGuard', () => {
  let guard: PublicGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        PublicGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(PublicGuard);

    localStorage.clear();
    sessionStorage.clear();
  });

  it('debería crearse', () => {
    expect(guard).toBeTruthy();
  });

  it('debería retornar true si no hay token en localStorage ni en sessionStorage', () => {
    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería retornar false y navegar a /home/characters si existe token en localStorage', () => {
    localStorage.setItem('token', '123456');
    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/characters']);
  });

  it('debería retornar false y navegar a /home/characters si existe token en sessionStorage', () => {
    sessionStorage.setItem('token', 'abcdef');
    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/characters']);
  });

  it('debería dar prioridad al token de localStorage si existe en ambos', () => {
    localStorage.setItem('token', 'local');
    sessionStorage.setItem('token', 'session');
    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/characters']);
    // Confirmamos que la navegación ocurrió solo una vez
    expect(routerSpy.navigate.calls.count()).toBe(1);
  });
});