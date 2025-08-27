import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from '../../service/messages.service';
import { FormErrorsService } from '../../service/form-error.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../shared/interfaces/auth-interfaces';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let messageService: jasmine.SpyObj<MessageService>;
  let formBuilder: FormBuilder;

  const mockLoginResponse: LoginResponse = {
    header: {
      resultCode: 0,
      message: 'Success',
    },
    data: {
      token: 'test-token',
      user: {
        id: '1',
        role: 'user',
        name: 'Test User',
        mail: 'test@example.com',
        address: {
          street: 'Test Street',
          location: 'Test Location',
          city: 'Test City',
          country: 'Test Country',
          cp: '1234',
        },
        birthday: '1990-01-01',
        phone: '123456789',
      },
    },
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'saveSession',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', [
      'clear',
      'processResultCode',
      'handleError',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        LoginComponent,
        DummyComponent,
      ],
      providers: [
        FormBuilder,
        provideRouter([
          { path: 'home/characters', component: DummyComponent },
          { path: 'auth/register', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
    formBuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente Login', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('debe inicializar loginForm con valores vacíos', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.get('mail')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
      expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    });

    it('debe recordar el mail si está en localStorage', () => {
      const rememberedMail = 'test@example.com';
      spyOn(localStorage, 'getItem').and.returnValue(rememberedMail);

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.loginForm.get('mail')?.value).toBe(rememberedMail);
      expect(component.loginForm.get('rememberMe')?.value).toBe(true);
    });
  });


  describe('onSubmit', () => {
    it('no debe llamar a authService.login si el formulario es inválido', () => {
      component.loginForm.setErrors({ invalid: true });
      component.onSubmit();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('debe llamar a authService.login con los valores del formulario cuando el formulario es válido', () => {
      const testMail = 'test@example.com';
      const testPassword = 'password123';
      const rememberMe = true;

      component.loginForm.patchValue({
        mail: testMail,
        password: testPassword,
        rememberMe: rememberMe,
      });

      authService.login.and.returnValue(of(mockLoginResponse));

      spyOn(router, 'navigate');
      spyOn(localStorage, 'setItem');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith(testMail, testPassword);
    });

    it('debe guardar la sesión y navegar a home tras un login exitoso', fakeAsync(() => {
      const testMail = 'test@example.com';
      const testPassword = 'password123';
      const rememberMe = true;

      component.loginForm.patchValue({
        mail: testMail,
        password: testPassword,
        rememberMe: rememberMe,
      });

      authService.login.and.returnValue(of(mockLoginResponse));
      spyOn(router, 'navigate');
      spyOn(localStorage, 'setItem');

      component.onSubmit();
      tick();

      expect(authService.saveSession).toHaveBeenCalledWith(
        mockLoginResponse.data.token,
        mockLoginResponse.data.user,
        rememberMe
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'rememberedMail',
        testMail
      );
      expect(router.navigate).toHaveBeenCalledWith(['/home/characters']);
      expect(messageService.processResultCode).toHaveBeenCalledWith(
        0,
        'Success'
      );
    }));

    it('debe manejar errores de login', fakeAsync(() => {
      const error = new Error('Login failed');
      component.loginForm.patchValue({
        mail: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });

      authService.login.and.returnValue(throwError(() => error));
      component.onSubmit();
      tick();

      expect(messageService.handleError).toHaveBeenCalledWith(error);
    }));

    it('debe eliminar el mail recordado de localStorage si rememberMe es falso', fakeAsync(() => {
      const testMail = 'test@example.com';
      const testPassword = 'password123';

      component.loginForm.patchValue({
        mail: testMail,
        password: testPassword,
        rememberMe: false,
      });

      authService.login.and.returnValue(of(mockLoginResponse));
      spyOn(localStorage, 'removeItem');

      component.onSubmit();
      tick();

      expect(localStorage.removeItem).toHaveBeenCalledWith('rememberedMail');
    }));

    it('debe manejar la respuesta de error del backend', fakeAsync(() => {
      const errorResponse: LoginResponse = {
        header: {
          resultCode: 1,
          error: 'Invalid credentials',
          message: 'Login failed',
        },
        data: {
          token: '',
          user: {
            id: '',
            role: '',
            name: '',
            mail: '',
            address: {
              street: '',
              location: '',
              city: '',
              country: '',
              cp: '',
            },
            birthday: '',
            phone: '',
          },
        },
      };

      component.loginForm.patchValue({
        mail: 'test@example.com',
        password: 'wrongpassword1',
        rememberMe: false,
      });

      authService.login.and.returnValue(of(errorResponse));
      component.onSubmit();
      tick();

      expect(messageService.processResultCode).toHaveBeenCalledWith(
        1,
        'Invalid credentials'
      );
    }));
  });

  describe('Error Messages', () => {
    it('debe devolver los mensajes correctos de error para mail', () => {
      const mailControl = component.loginForm.get('mail');

      mailControl?.setValue('');
      mailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.mailErrors).toBe('Email is required'); // mensaje real para required

      mailControl?.setValue('invalid');
      mailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.mailErrors).toBe('Email is not valid'); // mensaje real para formato

      mailControl?.setValue('a@b.c');
      mailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.mailErrors).toBe(
        'Email must be at least 10 characters long'
      ); // mensaje real para minLength

      mailControl?.setValue('a'.repeat(51) + '@example.com');
      mailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.mailErrors).toBe(
        'Email must be at most 50 characters long'
      ); // mensaje real para maxLength
    });

    it('debe devolver los mensajes correctos de error para password', () => {
      const passwordControl = component.loginForm.get('password');

      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.passwordErrors).toBe('Password is required');

      passwordControl?.setValue('short');
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.passwordErrors).toBe(
        'Password must be at least 8 characters long and include a letter and a number'
      );

      passwordControl?.setValue('A1'.repeat(16));
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.passwordErrors).toBe(
        'Password must be at most 30 characters long'
      );

      passwordControl?.setValue('password'); // letras sin número
      passwordControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.passwordErrors).toBe(
        'Password must be at least 8 characters long and include a letter and a number'
      );
    });

    it('debe llamar a FormErrorsService para los errores de mail y password', () => {
      spyOn(FormErrorsService, 'getMailError').and.returnValue(
        'Test Mail Error'
      );
      spyOn(FormErrorsService, 'getPasswordError').and.returnValue(
        'Test Password Error'
      );

      expect(component.mailErrors).toBe('Test Mail Error');
      expect(component.passwordErrors).toBe('Test Password Error');
    });

    it('debe procesar el mensaje del backend incluso sin la propiedad de error', fakeAsync(() => {
      const response: LoginResponse = {
        header: { resultCode: 2, message: 'Generic error' },
        data: {
          token: '',
          user: {
            id: '',
            role: '',
            name: '',
            mail: '',
            address: {
              street: '',
              location: '',
              city: '',
              country: '',
              cp: '',
            },
            birthday: '',
            phone: '',
          },
        },
      };

      component.loginForm.patchValue({
        mail: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
      authService.login.and.returnValue(of(response));

      component.onSubmit();
      tick();

      expect(messageService.processResultCode).toHaveBeenCalledWith(
        2,
        'Generic error'
      );
    }));
  });

  describe('Form Interaction', () => {
    it('debe limpiar los mensajes al cambiar los valores del formulario', () => {
      component.loginForm.patchValue({ mail: 'test@example.com' });
      expect(messageService.clear).toHaveBeenCalled();
    });
  });

  it('debe alternar el valor de rememberMe al hacer clic en el checkbox', () => {
    const checkbox: HTMLInputElement =
      fixture.nativeElement.querySelector('#rememberMe');
    expect(checkbox.checked).toBeFalse();

    checkbox.click();
    fixture.detectChanges();
    expect(component.loginForm.get('rememberMe')?.value).toBeTrue();
  });

  it('debe navegar a registro al hacer click en el enlace “Sign up”', fakeAsync(() => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a[href="/auth/register"]'
    );
    link.click();
    tick();
    expect(router.url).toBe('/auth/register');
  }));
});
