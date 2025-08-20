import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../service/users.service';
import { MessageService } from '../../service/messages.service';
import {
  RegisterRequest,
  RegisterResponse,
} from '../../shared/interfaces/auth-interfaces';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Componente ficticio para pruebas
@Component({ template: '' })
class DummyComponent {}

// Mocks para los servicios
class MockAuthService {
  register(userData: RegisterRequest) {
    return of({
      header: {
        resultCode: 200,
        message: 'User registered successfully',
      },
      data: {
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
          phone: '1234567890',
          date: '2024-01-01',
        },
      },
    } as RegisterResponse);
  }
}

class MockMessageService {
  clear = jasmine.createSpy('clear');
  processResultCode = jasmine.createSpy('processResultCode');
  handleError = jasmine.createSpy('handleError');
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let messageService: MessageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, RegisterComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: MessageService, useClass: MockMessageService },
        provideRouter([{ path: 'auth/login', component: DummyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores vacíos', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('mail')?.value).toBe('');
    expect(component.registerForm.get('passwordGroup.password')?.value).toBe(
      ''
    );
    expect(
      component.registerForm.get('passwordGroup.repeatPassword')?.value
    ).toBe('');
    expect(component.registerForm.get('address.street')?.value).toBe('');
    expect(component.registerForm.get('address.city')?.value).toBe('');
    expect(component.registerForm.get('address.country')?.value).toBe('');
    expect(component.registerForm.get('address.cp')?.value).toBe('');
    expect(component.registerForm.get('birthday')?.value).toBe('');
    expect(component.registerForm.get('phone')?.value).toBe('');
  });

  describe('Form Validation', () => {
    it('debería validar el campo del nombre', () => {
      const nameControl = component.registerForm.get('name');

      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBeTrue();

      nameControl?.setValue('abc');
      expect(nameControl?.hasError('minlength')).toBeTrue();

      nameControl?.setValue('a'.repeat(16));
      expect(nameControl?.hasError('maxlength')).toBeTrue();

      nameControl?.setValue('Valid Name');
      expect(nameControl?.valid).toBeTrue();
    });

    it('debería validar el campo del correo', () => {
      const emailControl = component.registerForm.get('mail');

      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBeTrue();

      emailControl?.setValue('invalid');
      expect(emailControl?.hasError('email')).toBeTrue();

      emailControl?.setValue('a@b.c');
      expect(emailControl?.hasError('minlength')).toBeTrue();

      emailControl?.setValue('a'.repeat(51) + '@test.com');
      expect(emailControl?.hasError('maxlength')).toBeTrue();

      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('debería validar el campo de la contraseña', () => {
      const passwordControl = component.registerForm.get(
        'passwordGroup.password'
      );

      passwordControl?.setValue('');
      expect(passwordControl?.hasError('required')).toBeTrue();

      passwordControl?.setValue('short');
      expect(passwordControl?.hasError('minlength')).toBeTrue();

      passwordControl?.setValue('a'.repeat(31));
      expect(passwordControl?.hasError('maxlength')).toBeTrue();

      passwordControl?.setValue('password'); // sin números
      expect(passwordControl?.hasError('pattern')).toBeTrue();

      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTrue();
    });

    it('debería validar la coincidencia de contraseñas', () => {
      const passwordGroup = component.registerForm.get('passwordGroup');
      const passwordControl = component.registerForm.get(
        'passwordGroup.password'
      );
      const repeatControl = component.registerForm.get(
        'passwordGroup.repeatPassword'
      );

      passwordControl?.setValue('password123');
      repeatControl?.setValue('different');

      expect(passwordGroup?.hasError('passwordsDontMatch')).toBeTrue();

      repeatControl?.setValue('password123');
      expect(passwordGroup?.valid).toBeTrue();
    });

    it('debería validar el grupo de address', () => {
      const addressGroup = component.registerForm.get('address');

      // Todos vacíos
      expect(addressGroup?.valid).toBeTrue();

      // Algunos campos llenos
      addressGroup?.get('street')?.setValue('Test Street');
      expect(addressGroup?.hasError('incompleteAddress')).toBeTrue();

      // Todos los campos llenos
      addressGroup?.get('city')?.setValue('Test City');
      addressGroup?.get('country')?.setValue('Test Country');
      addressGroup?.get('cp')?.setValue('1234');
      expect(addressGroup?.valid).toBeTrue();
    });

    it('debería invalidar el formulario si se completa parcialmente la dirección, obligando a llenar todos los campos de addressGroup', () => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const addressGroup = component.registerForm.get('address');
      addressGroup?.get('street')?.setValue('123 Main St'); // solo un campo

      component.onSubmit();
      expect(component.registerForm.valid).toBeFalse();
    });

    it('debería invalidar el grupo de contraseñas si ambos campos están vacíos', () => {
      const passwordGroup = component.registerForm.get('passwordGroup');
      passwordGroup?.get('password')?.setValue('');
      passwordGroup?.get('repeatPassword')?.setValue('');
      expect(passwordGroup?.valid).toBeFalse();
    });

    it('debería invalidar el grupo de contraseñas si solo se llena un campo', () => {
      const passwordGroup = component.registerForm.get('passwordGroup');
      passwordGroup?.get('password')?.setValue('password123');
      passwordGroup?.get('repeatPassword')?.setValue('');
      expect(passwordGroup?.hasError('passwordsDontMatch')).toBeTrue();
    });

    it('debería marcar el grupo de dirección como inválido si se completa parcialmente', () => {
      const addressGroup = component.registerForm.get('address');
      addressGroup?.get('street')?.setValue('Test Street');
      expect(addressGroup?.hasError('incompleteAddress')).toBeTrue();
    });

    it('debería marcar todos los campos de dirección como tocados si se modifica al menos uno', () => {
      const addressGroup = component.registerForm.get('address');
      addressGroup?.get('street')?.setValue('Some Street');
      expect(addressGroup?.get('street')?.touched).toBeTrue();
      expect(addressGroup?.get('city')?.touched).toBeTrue();
      expect(addressGroup?.get('country')?.touched).toBeTrue();
      expect(addressGroup?.get('cp')?.touched).toBeTrue();
    });

    it('debería mostrar el mensaje de error del campo nombre solo después de que ha sido tocado', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.setValue('');
      fixture.detectChanges();
      let errorEl = fixture.debugElement.query(By.css('.text-danger'));
      expect(errorEl.nativeElement.textContent.trim()).toBe('');

      nameControl?.markAsTouched();
      fixture.detectChanges();
      errorEl = fixture.debugElement.query(By.css('.text-danger'));
      expect(errorEl.nativeElement.textContent).toContain('Name is required.');
    });
  });

  describe('Error Messages', () => {
    it('debería retornar los mensajes de error del nombre correctamente', () => {
      const nameControl = component.registerForm.get('name');

      nameControl?.setValue('');
      nameControl?.markAsTouched();
      expect(component.nameError).toBe('Name is required.');

      nameControl?.setValue('abc');
      expect(component.nameError).toBe('Name must have at least 5 characters.');

      nameControl?.setValue('a'.repeat(16));
      expect(component.nameError).toBe('Name cannot exceed 15 characters.');
    });

    it('debería retornar los mensajes de error del correo correctamente', () => {
      const emailControl = component.registerForm.get('mail');

      emailControl?.setValue('');
      emailControl?.markAsTouched();
      expect(component.mailError).toBe('Email is required.');

      emailControl?.setValue('invalid');
      expect(component.mailError).toBe('You must enter a valid email.');
    });

    it('debería retornar los mensajes de error de la contraseña correctamente', () => {
      const passwordControl = component.registerForm.get(
        'passwordGroup.password'
      );

      passwordControl?.setValue('');
      passwordControl?.markAsTouched();
      expect(component.passwordError).toBe('Password is required.');

      passwordControl?.setValue('short');
      expect(component.passwordError).toBe(
        'Password must have at least 8 characters.'
      );
    });

    it('debería retornar los mensajes de error de la dirección correctamente', () => {
      const addressGroup = component.registerForm.get('address');

      addressGroup?.get('street')?.setValue('Test Street');
      addressGroup?.markAllAsTouched();

      expect(component.getAddressError('city')).toBe('This field is required.');
    });
  });

  describe('Form Submission', () => {
    it('debería no enviar el formulario si es inválido', () => {
      const registerSpy = spyOn(authService, 'register');

      component.onSubmit();

      expect(registerSpy).not.toHaveBeenCalled();
      expect(component.registerForm.touched).toBeTrue();
    });

    it('debería llamar a handleError del MessageService cuando el registro falla con error del servidor', () => {
      const errorResponse = {
        error: { header: { resultCode: 500, error: 'Server error' } },
      };
      const registerSpy = spyOn(authService, 'register').and.returnValue(
        throwError(() => errorResponse)
      );

      // Llenar el formulario con datos válidos
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      component.onSubmit();

      expect(messageService.handleError).toHaveBeenCalledWith(errorResponse);
    });

    it('debería llamar a markAllAsTouched para mostrar errores al enviar un formulario inválido', () => {
      const markAllAsTouchedSpy = spyOn(
        component.registerForm,
        'markAllAsTouched'
      );
      component.registerForm.get('name')?.setValue('');
      component.onSubmit();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('debería aplicar valores predeterminados en el payload si los campos opcionales están vacíos', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const authSpy = spyOn(authService, 'register').and.callThrough();
      component.onSubmit();

      const payload = authSpy.calls.mostRecent().args[0];
      expect(payload.birthday).toBe('1900-01-01');
      expect(payload.address.street).toBe('-');
      expect(payload.address.cp).toBe('1111');
      tick(1500);
    }));

    it('no debería enviar el formulario si este es inválido', () => {
      const authSpy = spyOn(authService, 'register');
      component.registerForm.get('name')?.setValue('');
      component.onSubmit();
      expect(authSpy).not.toHaveBeenCalled();
    });

    it('debería llamar a processResultCode en caso de registro exitoso', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      component.onSubmit();
      expect(messageService.processResultCode).toHaveBeenCalledWith(
        200,
        'User registered successfully'
      );
      tick(1500);
    }));

    it('debería navegar a login después de un registro exitoso con timeout', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const navigateSpy = spyOn(router, 'navigate');
      component.onSubmit();
      tick(1500);
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    }));

    it('no debería navegar al login si el formulario es inválido', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.registerForm.get('name')?.setValue('');
      component.onSubmit();
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('debería enviar el formulario correctamente y aplicar valores por defecto cuando los campos opcionales están vacíos', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const authSpy = spyOn(authService, 'register').and.callThrough();
      component.onSubmit();

      const payload = authSpy.calls.mostRecent().args[0];
      expect(payload.address.street).toBe('-');
      expect(payload.address.city).toBe('-');
      expect(payload.address.country).toBe('-');
      expect(payload.address.cp).toBe('1111');
      expect(payload.birthday).toBe('1900-01-01');
      expect(payload.phone).toBe('190001012');
      tick(1500);
    }));

    it('debería enviar el formulario correctamente usando todos los valores ingresados en los campos opcionales', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const addressGroup = component.registerForm.get('address');
      addressGroup?.get('street')?.setValue('123 Main St');
      addressGroup?.get('city')?.setValue('Test City');
      addressGroup?.get('country')?.setValue('Argentina');
      addressGroup?.get('cp')?.setValue('4321');

      component.registerForm.get('birthday')?.setValue('2000-01-01');
      component.registerForm.get('phone')?.setValue('555123456');

      const authSpy = spyOn(authService, 'register').and.callThrough();
      component.onSubmit();

      const payload = authSpy.calls.mostRecent().args[0];
      expect(payload.address.street).toBe('123 Main St');
      expect(payload.address.city).toBe('Test City');
      expect(payload.address.country).toBe('Argentina');
      expect(payload.address.cp).toBe('4321');
      expect(payload.birthday).toBe('2000-01-01');
      expect(payload.phone).toBe('555123456');
      tick(1500);
    }));

    it('debería enviar el formulario correctamente y rellenar automáticamente los campos opcionales vacíos con valores por defecto', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const addressGroup = component.registerForm.get('address');
      // Para que sea válido, si llenás street y country, también llená city y cp (aunque sea con defaults)
      addressGroup?.get('street')?.setValue('123 Main St');
      addressGroup?.get('city')?.setValue('Some City');
      addressGroup?.get('country')?.setValue('Argentina');
      addressGroup?.get('cp')?.setValue('1234');

      component.registerForm.get('birthday')?.setValue(''); // opcional
      component.registerForm.get('phone')?.setValue('555123456'); // opcional

      fixture.detectChanges();

      const authSpy = spyOn(authService, 'register').and.callThrough();
      component.onSubmit();

      expect(authSpy).toHaveBeenCalled(); // ✅ ahora sí se llama

      const payload = authSpy.calls.mostRecent().args[0];
      expect(payload.address.street).toBe('123 Main St');
      expect(payload.address.city).toBe('Some City');
      expect(payload.address.country).toBe('Argentina');
      expect(payload.address.cp).toBe('1234');
      expect(payload.birthday).toBe('1900-01-01'); // default
      expect(payload.phone).toBe('555123456');

      tick(1500);
    }));

    it('debería bloquear el envío si los campos opcionales contienen solo espacios', fakeAsync(() => {
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      const addressGroup = component.registerForm.get('address');
      addressGroup?.get('street')?.setValue('   ');
      addressGroup?.get('city')?.setValue('   ');
      addressGroup?.get('country')?.setValue('   ');
      addressGroup?.get('cp')?.setValue('   ');

      component.registerForm.get('birthday')?.setValue('   ');
      component.registerForm.get('phone')?.setValue('   ');

      fixture.detectChanges();

      const authSpy = spyOn(authService, 'register').and.callThrough();
      component.onSubmit();

      // Como los campos opcionales con solo espacios bloquean el submit,
      // authService.register NO debería haberse llamado
      expect(authSpy).not.toHaveBeenCalled();
    }));
  });

  describe('Template Integration', () => {
    it('debería mostrar el mensaje de "Name is required" cuando no se ingresa nada', () => {
      const nameControl = component.registerForm.get('name');

      nameControl?.setValue('');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.text-danger'));
      expect(errorElement.nativeElement.textContent).toContain(
        'Name is required.'
      );
    });

    it('debería habilitar el botón de enviar cuando el formulario es válido', () => {
      // Llena el formulario con datos válidos
      component.registerForm.get('name')?.setValue('Test User');
      component.registerForm.get('mail')?.setValue('test@example.com');
      component.registerForm
        .get('passwordGroup.password')
        ?.setValue('password123');
      component.registerForm
        .get('passwordGroup.repeatPassword')
        ?.setValue('password123');

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton.nativeElement.disabled).toBeFalse();
    });

    it('debería llamar a onSubmit al enviar el formulario', () => {
      const onSubmitSpy = spyOn(component, 'onSubmit');

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      expect(onSubmitSpy).toHaveBeenCalled();
    });

    it('debería mostrar un enlace que redirija al login (/auth/login)', () => {
      const loginLink = fixture.debugElement.query(By.css('.loged-user a'));

      expect(loginLink).toBeTruthy(); // aseguramos que existe
      expect(
        loginLink.nativeElement.getAttribute('ng-reflect-router-link')
      ).toBe('/auth/login');
      expect(loginLink.nativeElement.textContent).toContain(
        'Already Signed Up? Sing In'
      );
    });
  });

  describe('Value Changes Subscription', () => {
    it('debería limpiar los mensajes al cambiar los valores del nombre del formulario', () => {
      component.registerForm.get('name')?.setValue('New Name');

      expect(messageService.clear).toHaveBeenCalled();
    });

    it('debería limpiar los mensajes al cambiar los valores del correo del formulario', () => {
      component.registerForm.get('mail')?.setValue('new@mail.com');
      expect(messageService.clear).toHaveBeenCalled();
    });
  });
});
