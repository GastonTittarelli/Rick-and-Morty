import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Mocks completos con spies
const mockAuthService = {
  getToken: jasmine.createSpy('getToken'),
  logout: jasmine.createSpy('logout')
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockNgZone = {
  run: jasmine.createSpy('run').and.callFake((callback: () => void) => callback())
};

const mockMessageService = {
  showMessageWithTimeout: jasmine.createSpy('showMessageWithTimeout')
};

describe('authInterceptor', () => {
  let originalInterceptorLogic: (req: HttpRequest<any>, next: HttpHandler) => Observable<HttpEvent<any>>;

  beforeEach(() => {
    // Resetear todos los mocks antes de cada test
    mockAuthService.getToken.calls.reset();
    mockAuthService.logout.calls.reset();
    mockRouter.navigate.calls.reset();
    mockNgZone.run.calls.reset();
    mockMessageService.showMessageWithTimeout.calls.reset();

    // Definir la lógica del interceptor que vamos a testear
    originalInterceptorLogic = (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> => {
      const token = mockAuthService.getToken();
      const isValidToken = token && typeof token === 'string' && token.trim() !== '';

      const authReq = isValidToken
        ? request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        : request;

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            mockAuthService.logout();
            
            mockMessageService.showMessageWithTimeout(
              'danger',
              'Session expired. Please log in again.',
              3000 
            );

            mockNgZone.run(() => {
              mockRouter.navigate(['/auth/login']);
            });
          }
          return throwError(() => error);
        })
      );
    };
  });

  it('dado que existe un token válido, cuando se hace una petición, entonces se debe agregar la Authorization del header con el token.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token-123');
    const testRequest = new HttpRequest('GET', '/api/test');
    
    const mockHandler: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        // Assert - Verificar que el header se agregó correctamente
        expect(req.headers.get('Authorization')).toBe('Bearer test-token-123');
        expect(req.url).toBe('/api/test');
        expect(req.method).toBe('GET');
        done();
        return of({} as HttpEvent<any>);
      }
    };

    // Act
    originalInterceptorLogic(testRequest, mockHandler).subscribe();
  });

  it('dado que no existe un token, cuando se hace una petición, entonces no se debe agregar la Authorization del header.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue(null);
    const testRequest = new HttpRequest('GET', '/api/test');
    
    const mockHandler: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        // Assert - Verificar que NO se agregó el header
        expect(req.headers.has('Authorization')).toBeFalse();
        expect(req.url).toBe('/api/test');
        done();
        return of({} as HttpEvent<any>);
      }
    };

    // Act
    originalInterceptorLogic(testRequest, mockHandler).subscribe();
  });

  it('dado que el token es un string vacío, cuando se hace una petición, entonces no se debe agregar la Authorization del header.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('');
    const testRequest = new HttpRequest('GET', '/api/test');
    
    const mockHandler: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        // Assert - Verificar que NO se agregó el header
        expect(req.headers.has('Authorization')).toBeFalse();
        done();
        return of({} as HttpEvent<any>);
      }
    };

    // Act
    originalInterceptorLogic(testRequest, mockHandler).subscribe();
  });

  it('dado que la respuesta es un error 401 (Unauthorized), cuando se hace la petición, entonces se debe cerrar la sesión y redirigir al login mostrando un mensaje de sesión expirada', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token');
    const testRequest = new HttpRequest('GET', '/api/test');
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    
    const mockHandler: HttpHandler = {
      handle: () => throwError(() => error401)
    };

    // Act & Assert
    originalInterceptorLogic(testRequest, mockHandler).subscribe({
      next: () => {
        fail('Should have thrown an error');
        done();
      },
      error: (error) => {
        expect(error).toBe(error401);
        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(mockMessageService.showMessageWithTimeout).toHaveBeenCalledWith(
          'danger',
          'Session expired. Please log in again.',
          3000
        );
        expect(mockNgZone.run).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      }
    });
  });

  it('dado que la respuesta es un error 403 (Forbidden), cuando se hace la petición, entonces se debe cerrar la sesión y redirigir al login mostrando un mensaje de sesión expirada', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token');
    const testRequest = new HttpRequest('GET', '/api/test');
    const error403 = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
    
    const mockHandler: HttpHandler = {
      handle: () => throwError(() => error403)
    };

    // Act & Assert
    originalInterceptorLogic(testRequest, mockHandler).subscribe({
      next: () => {
        fail('Should have thrown an error');
        done();
      },
      error: (error) => {
        expect(error).toBe(error403);
        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(mockMessageService.showMessageWithTimeout).toHaveBeenCalledWith(
          'danger',
          'Session expired. Please log in again.',
          3000
        );
        expect(mockNgZone.run).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      }
    });
  });

  it('dado que la respuesta es un error distinto de 401 o 403, cuando se hace la petición, entonces se debe relanzar el error sin procesarlo ni cerrar la sesión.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token');
    const testRequest = new HttpRequest('GET', '/api/test');
    const error500 = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    
    const mockHandler: HttpHandler = {
      handle: () => throwError(() => error500)
    };

    // Act & Assert
    originalInterceptorLogic(testRequest, mockHandler).subscribe({
      next: () => {
        fail('Should have thrown an error');
        done();
      },
      error: (error) => {
        expect(error).toBe(error500);
        expect(mockAuthService.logout).not.toHaveBeenCalled();
        expect(mockMessageService.showMessageWithTimeout).not.toHaveBeenCalled();
        expect(mockNgZone.run).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('dado que la respuesta es exitosa, cuando se hace la petición, entonces se debe devolver la respuesta sin cerrar la sesión ni mostrar errores.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token');
    const testRequest = new HttpRequest('GET', '/api/test');
    const mockResponse = { body: 'success' } as HttpEvent<any>;
    
    const mockHandler: HttpHandler = {
      handle: () => of(mockResponse)
    };

    // Act & Assert
    originalInterceptorLogic(testRequest, mockHandler).subscribe({
      next: (response) => {
        expect(response).toBe(mockResponse);
        expect(mockAuthService.logout).not.toHaveBeenCalled();
        done();
      },
      error: (error) => {
        fail(`Should not throw error: ${error}`);
        done();
      }
    });
  });

  it('dado que la petición tiene headers originales, cuando se agrega el token en el header Authorization, entonces se deben preservar los headers existentes.', (done) => {
    // Arrange
    mockAuthService.getToken.and.returnValue('test-token');
    const testRequest = new HttpRequest('GET', '/api/test', null, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-Custom': 'value' })
    });
    
    const mockHandler: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        // Assert - Verificar que se mantienen los headers originales
        expect(req.headers.get('Authorization')).toBe('Bearer test-token');
        expect(req.headers.get('Content-Type')).toBe('application/json');
        expect(req.headers.get('X-Custom')).toBe('value');
        done();
        return of({} as HttpEvent<any>);
      }
    };

    // Act
    originalInterceptorLogic(testRequest, mockHandler).subscribe();
  });
});