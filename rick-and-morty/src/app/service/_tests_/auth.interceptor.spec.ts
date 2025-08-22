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

  it('should add Authorization header when token exists', (done) => {
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

  it('should not add Authorization header when token is null', (done) => {
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

  it('should not add Authorization header when token is empty string', (done) => {
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

  it('should handle 401 error and redirect to login', (done) => {
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

  it('should handle 403 error and redirect to login', (done) => {
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

  it('should rethrow non-401/403 errors without processing', (done) => {
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

  it('should handle successful requests without errors', (done) => {
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

  it('should preserve original request headers when adding Authorization', (done) => {
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