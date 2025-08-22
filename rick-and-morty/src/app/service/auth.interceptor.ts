import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../service/users.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './messages.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const ngZone = inject(NgZone);
  const messageService = inject(MessageService); 

  const token = authService.getToken();
  const isValidToken = token && typeof token === 'string' && token.trim() !== '';

  const authReq = isValidToken
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : request;
try {
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        
        messageService.showMessageWithTimeout(
          'danger',
          'Session expired. Please log in again.',
          3000 
        );

        ngZone.run(() => {
          router.navigate(['/auth/login']);
        });
      }
      return throwError(() => error);
    })
  );
} catch (err) {
    // Fallback seguro
    return throwError(() => new Error('Interceptor error'));
  }
};
