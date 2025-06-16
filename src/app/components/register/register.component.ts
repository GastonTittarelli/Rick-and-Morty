import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../service/auth-messages.service';

// Este validador se aplica sobre el FormGroup `address`
export const addressGroupValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const fields = ['street', 'city', 'country', 'cp'];
  const anyFilled = fields.some(field => !!group.get(field)?.value?.trim());

  if (!anyFilled) return null; // No hay ninguno completado → válido

  const allValid = fields.every(field => !!group.get(field)?.value?.trim());
  return allValid ? null : { incompleteAddress: true };
};
// password validator
export const passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const repeat = group.get('repeatPassword')?.value;
  return password === repeat ? null : { passwordsDontMatch: true };
};

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      mail: ['', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(50)]],
      
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
        repeatPassword: ['']
      }, { validators: passwordMatchValidator }),

      address: this.fb.group({
        street: ['', [Validators.maxLength(50)]],
        city: ['', [Validators.maxLength(50)]],
        country: ['', [Validators.maxLength(50)]],
        cp: ['', [Validators.minLength(4), Validators.maxLength(4)]],
      },{ validators: addressGroupValidator }),
      birthday: [''],
      phone: ['', [Validators.maxLength(15)]]
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.messageService.clear();
    });
  
  }

  
// errorMessage: string = '';

onSubmit(): void {
  if (this.registerForm.invalid) {
    // console.log('Formulario inválido:');
    // console.log('name', this.registerForm.get('name')?.valid);
    // console.log('mail', this.registerForm.get('mail')?.valid);
    // console.log('passwordGroup', this.registerForm.get('passwordGroup')?.valid);
    // console.log('address', this.registerForm.get('address')?.valid);
    // console.log('phone', this.registerForm.get('phone')?.valid);
    // console.log('birthday', this.registerForm.get('birthday')?.valid);
    this.registerForm.markAllAsTouched();
    return;
  }

  const formValue = this.registerForm.value;

  const payload = {
    name: formValue.name,
    mail: formValue.mail,
    password: formValue.passwordGroup.password, // 👈 importante
    address: {
        ...formValue.address,
        location: "-"
      },
    birthday: formValue.birthday || '1900-01-01',
    phone: formValue.phone || '190001012'
  };

  this.auth.register(payload).subscribe({
      next: (res) => {
        const code = res.header.resultCode;
        const message = res.header.message;

        this.messageService.processResultCode(code, message);
        this.router.navigate(['/layout/login']);
      },
      error: (err) => {
        this.messageService.handleError(err);
      },
    });
  }
}
