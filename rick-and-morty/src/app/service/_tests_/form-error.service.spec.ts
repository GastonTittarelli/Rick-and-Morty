import { FormErrorsService } from '../form-error.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('FormErrorsService', () => {
  describe('getMailError', () => {
    it('dado que el campo de email no existe, cuando se obtiene el error, entonces el resultado debe ser null ', () => {
      expect(FormErrorsService.getMailError(null)).toBeNull();
    });

    it('dado que el campo de email está vacío y es requerido, cuando se obtiene el error, entonces debe indicar que el email es requerido', () => {
      const control = new FormControl('', { validators: [] });
      control.markAsTouched();
      control.setErrors({ required: true });
      expect(FormErrorsService.getMailError(control)).toBe('Email is required');
    });

    it('dado que el campo de email tiene un formato inválido, cuando se obtiene el error, entonces debe indicar que el email no es válido.', () => {
      const control = new FormControl('invalid');
      control.markAsTouched();
      control.setErrors({ email: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email is not valid'
      );
    });

    it('dado que el campo de email es demasiado corto, cuando se obtiene el error, entonces debe indicar que debe tener al menos 10 caracteres.', () => {
      const control = new FormControl('short');
      control.markAsTouched();
      control.setErrors({ minlength: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email must be at least 10 characters long'
      );
    });

    it('dado que el campo de email es demasiado largo, cuando se obtiene el error, entonces debe indicar que debe tener como máximo 50 caracteres', () => {
      const control = new FormControl('long'.repeat(20));
      control.markAsTouched();
      control.setErrors({ maxlength: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email must be at most 50 characters long'
      );
    });

    it('dado que el campo de email es válido, cuando se obtiene el error, entonces el resultado debe ser null (no hay errores).', () => {
      const control = new FormControl('valid@email.com');
      control.markAsTouched();
      control.setErrors(null);
      expect(FormErrorsService.getMailError(control)).toBeNull();
    });
  });

  describe('getPasswordGroupError and passwordMatchValidator', () => {
    it('dado que las contraseñas no coinciden, cuando se valida el formulario, entonces debe mostrar un error indicando que las contraseñas no coinciden', () => {
      const group = new FormGroup({
        password: new FormControl('12345678'),
        repeatPassword: new FormControl('87654321'),
      });

      // Marcar repeatPassword como tocado
      group.get('repeatPassword')?.markAsTouched();

      // Asignar el error del validador al grupo
      group.setErrors(FormErrorsService.passwordMatchValidator(group));

      expect(FormErrorsService.getPasswordGroupError(group)).toBe(
        'Passwords do not match.'
      );
    });

    it('dado que las contraseñas coinciden, cuando se valida el formulario, entonces el resultado debe ser null (no hay errores)', () => {
      const group = new FormGroup({
        password: new FormControl('12345678'),
        repeatPassword: new FormControl('12345678'),
      });
      group.setErrors(FormErrorsService.passwordMatchValidator(group));
      expect(FormErrorsService.getPasswordGroupError(group)).toBeNull();
    });
  });

  describe('addressGroupValidator and getAddressFieldError', () => {
    it('dado que la dirección está incompleta y un campo fue tocado, cuando se valida, entonces debe mostrar un error indicando que el campo es requerido', () => {
      const group = new FormGroup({
        street: new FormControl(''),
        city: new FormControl('City'),
        country: new FormControl(''),
        cp: new FormControl('1234'),
      });

      // Asignar el error del validador al grupo
      const validatorError = FormErrorsService.addressGroupValidator(group);
      group.setErrors(validatorError);

      // Marcar el control como tocado para que getAddressFieldError lo detecte
      group.get('street')?.markAsTouched();

      expect(FormErrorsService.getAddressFieldError(group, 'street')).toBe(
        'This field is required.'
      );
    });

    it('dado que todos los campos de dirección están vacíos, cuando se valida, entonces el resultado debe ser null (no hay errores)', () => {
      const group = new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        country: new FormControl(''),
        cp: new FormControl(''),
      });
      expect(FormErrorsService.addressGroupValidator(group)).toBeNull();
    });

    it('dado que la dirección está completa, cuando se valida, entonces el resultado debe ser null (no hay errores)', () => {
      const group = new FormGroup({
        street: new FormControl('Main St'),
        city: new FormControl('City'),
        country: new FormControl('Country'),
        cp: new FormControl('1234'),
      });
      expect(FormErrorsService.addressGroupValidator(group)).toBeNull();
    });
  });

  describe('conditionalMinLength and conditionalMaxLength', () => {
    it('dado que un campo tiene menos caracteres que el mínimo requerido, cuando se valida, entonces debe devolver un error de longitud mínima; y si cumple la longitud o está vacío, el resultado debe ser null.', () => {
      const validator = FormErrorsService.conditionalMinLength(5);
      expect(validator(new FormControl('1234'))).toEqual({
        minlength: { requiredLength: 5, actualLength: 4 },
      });
      expect(validator(new FormControl('12345'))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('dado que un campo tiene más caracteres que el máximo permitido, cuando se valida, entonces debe devolver un error de longitud máxima; y si cumple la longitud o está vacío, el resultado debe ser null.', () => {
      const validator = FormErrorsService.conditionalMaxLength(5);
      expect(validator(new FormControl('123456'))).toEqual({
        maxlength: { requiredLength: 5, actualLength: 6 },
      });
      expect(validator(new FormControl('12345'))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });
  });
});
