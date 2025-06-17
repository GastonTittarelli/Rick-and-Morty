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
      if (control.hasError('required')) return 'El email es obligatorio.';
      if (control.hasError('email')) return 'Debe ingresar un email válido.';
      if (control.hasError('minlength'))
        return 'El email debe tener al menos 10 caracteres.';
      if (control.hasError('maxlength'))
        return 'El email no puede superar los 50 caracteres.';
    }
    return null;
  }

  static getNameError(control: AbstractControl | null): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'El nombre es obligatorio.';
      if (control.hasError('minlength'))
        return 'El nombre debe tener al menos 5 caracteres.';
      if (control.hasError('maxlength'))
        return 'El nombre no puede superar los 15 caracteres.';
    }
    return null;
  }

  static getRegisterPasswordError(
    control: AbstractControl | null
  ): string | null {
    if (!control) return null;
    if (control.touched || control.dirty) {
      if (control.hasError('required')) return 'La contraseña es obligatoria.';
      if (control.hasError('minlength'))
        return 'La contraseña debe tener al menos 8 caracteres.';
      if (control.hasError('maxlength'))
        return 'La contraseña no puede superar los 30 caracteres.';
      if (control.hasError('pattern'))
        return 'La contraseña debe contener al menos una letra y un número.';
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
        return 'Las contraseñas no coinciden.';
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
      return 'El código postal debe tener 4 caracteres.';
    }

    if (
      addressGroup.hasError('incompleteAddress') &&
      !hasValue &&
      (control.touched || control.dirty)
    ) {
      return 'Este campo es requerido.';
    }

    return null;
  }
}
