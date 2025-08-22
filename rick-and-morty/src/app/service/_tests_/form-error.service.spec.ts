import { FormErrorsService } from '../form-error.service';
import { FormControl, FormGroup } from '@angular/forms';

describe('FormErrorsService', () => {
  describe('getMailError', () => {
    it('should return null if control is null', () => {
      expect(FormErrorsService.getMailError(null)).toBeNull();
    });

    it('should return required error', () => {
      const control = new FormControl('', { validators: [] });
      control.markAsTouched();
      control.setErrors({ required: true });
      expect(FormErrorsService.getMailError(control)).toBe('Email is required');
    });

    it('should return email error', () => {
      const control = new FormControl('invalid');
      control.markAsTouched();
      control.setErrors({ email: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email is not valid'
      );
    });

    it('should return minlength error', () => {
      const control = new FormControl('short');
      control.markAsTouched();
      control.setErrors({ minlength: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email must be at least 10 characters long'
      );
    });

    it('should return maxlength error', () => {
      const control = new FormControl('long'.repeat(20));
      control.markAsTouched();
      control.setErrors({ maxlength: true });
      expect(FormErrorsService.getMailError(control)).toBe(
        'Email must be at most 50 characters long'
      );
    });

    it('should return null if no relevant errors', () => {
      const control = new FormControl('valid@email.com');
      control.markAsTouched();
      control.setErrors(null);
      expect(FormErrorsService.getMailError(control)).toBeNull();
    });
  });

  describe('getPasswordGroupError and passwordMatchValidator', () => {
    it('should detect passwords dont match', () => {
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

    it('should return null if passwords match', () => {
      const group = new FormGroup({
        password: new FormControl('12345678'),
        repeatPassword: new FormControl('12345678'),
      });
      group.setErrors(FormErrorsService.passwordMatchValidator(group));
      expect(FormErrorsService.getPasswordGroupError(group)).toBeNull();
    });
  });

  describe('addressGroupValidator and getAddressFieldError', () => {
    it('should return incompleteAddress error if some fields missing', () => {
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

    it('should return null if all fields empty', () => {
      const group = new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        country: new FormControl(''),
        cp: new FormControl(''),
      });
      expect(FormErrorsService.addressGroupValidator(group)).toBeNull();
    });

    it('should return null if all fields filled', () => {
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
    it('should validate min length', () => {
      const validator = FormErrorsService.conditionalMinLength(5);
      expect(validator(new FormControl('1234'))).toEqual({
        minlength: { requiredLength: 5, actualLength: 4 },
      });
      expect(validator(new FormControl('12345'))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('should validate max length', () => {
      const validator = FormErrorsService.conditionalMaxLength(5);
      expect(validator(new FormControl('123456'))).toEqual({
        maxlength: { requiredLength: 5, actualLength: 6 },
      });
      expect(validator(new FormControl('12345'))).toBeNull();
      expect(validator(new FormControl(''))).toBeNull();
    });
  });
});
