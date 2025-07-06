import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// import { passwordMatchValidator } from '../validators/register-form-validators';

export class FormErrorsService {
  // Login component
  static getMailError(control: AbstractControl | null): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'Email is required';
      if (control.hasError('email')) return 'Email is not valid';
    }
    return null;
  }

  static getPasswordError(control: AbstractControl | null): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'Password is required';
      if (control.hasError('minlength') || control.hasError('pattern')) {
        return 'Password must be at least 8 characters long and include a letter and a number';
      }
    }
    return null;
  }

  
  // Register component
  static getRegisterMailError(control: AbstractControl | null): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'Email is required.';
      if (control.hasError('email')) return 'You must enter a valid email.';
      if (control.hasError('minlength'))
        return 'Email must have at least 10 characters.';
      if (control.hasError('maxlength'))
        return 'Email cannot exceed 50 characters.';
    }
    return null;
  }

  static getNameError(control: AbstractControl | null): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'Name is required.';
      if (control.hasError('minlength'))
        return 'Name must have at least 5 characters.';
      if (control.hasError('maxlength'))
        return 'Name cannot exceed 15 characters.';
    }
    return null;
  }

  static getRegisterPasswordError(
    control: AbstractControl | null
  ): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'Password is required.';
      if (control.hasError('minlength'))
        return 'Password must have at least 8 characters.';
      if (control.hasError('maxlength'))
        return 'Password cannot exceed 30 characters.';
      if (control.hasError('pattern'))
        return 'Password must contain at least one letter and one number.';
    }
    return null;
  }

  // Helper de Validador = de contraseñas
  static getPasswordGroupError(control: AbstractControl | null): string | null {
    if (!control) return null;

    const repeatPasswordControl = control.get('repeatPassword');

    if (
      repeatPasswordControl &&
      (repeatPasswordControl.touched || repeatPasswordControl.dirty)
    ) {
      if (control.hasError('passwordsDontMatch')) {
        return 'Passwords do not match.';
      }
    }

    return null;
  }
  // Validador = de contraseñas
  static passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const repeat = group.get('repeatPassword')?.value;
    return password === repeat ? null : { passwordsDontMatch: true };
  };

  // Validador del requerimiento de los campos de dirección
  static addressGroupValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const fields = ['street', 'city', 'country', 'cp'];
    const anyFilled = fields.some((field) => !!group.get(field)?.value?.trim());

    if (!anyFilled) return null;

    const allValid = fields.every((field) => !!group.get(field)?.value?.trim());
    return allValid ? null : { incompleteAddress: true };
  };

  // Helper de Validador de req de campos de dirección
  static getAddressFieldError(
    addressGroup: AbstractControl | null,
    field: string
  ): string | null {
    if (!addressGroup) return null;
    const control = addressGroup.get(field);
    if (!control) return null;

    const hasValue = control.value?.trim();

    if (
      field === 'cp' &&
      hasValue &&
      (control.errors?.['minlength'] || control.errors?.['maxlength'])
    ) {
      return 'Zip must be 4 characters.';
    }

    if (
      addressGroup.hasError('incompleteAddress') &&
      !hasValue &&
      (control.touched || control.dirty)
    ) {
      return 'This field is required.';
    }

    return null;
  }
}
