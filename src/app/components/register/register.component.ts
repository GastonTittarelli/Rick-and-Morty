import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../service/auth-messages.service';
import { FormErrorsService } from '../../service/form-error.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
        ],
      ],
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],

      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(30),
              Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
            ],
          ],
          repeatPassword: [''],
        },
        { validators: FormErrorsService.passwordMatchValidator }
      ),

      address: this.fb.group(
        {
          street: ['', [Validators.maxLength(50)]],
          city: ['', [Validators.maxLength(50)]],
          country: ['', [Validators.maxLength(50)]],
          cp: ['', [Validators.minLength(4), Validators.maxLength(4)]],
        },
        { validators: FormErrorsService.addressGroupValidator }
      ),
      birthday: [''],
      phone: ['', [Validators.maxLength(15)]],
    });

    this.registerForm.get('address')?.valueChanges.subscribe(() => {
      const addressGroup = this.registerForm.get('address');
      const fields = ['street', 'city', 'country', 'cp'];

      const anyFilled = fields.some(
        (field) => !!addressGroup?.get(field)?.value?.trim()
      );

      if (anyFilled) {
        fields.forEach((field) => {
          const control = addressGroup?.get(field);
          if (control && !control.touched) {
            control.markAsTouched();
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    const payload = {
      name: formValue.name,
      mail: formValue.mail,
      password: formValue.passwordGroup.password,
      address: {
        ...formValue.address,
        location: '-',
        street: "-",
        city: "-",
        country: "-",
        cp: "1111"
      },
      birthday: formValue.birthday || '1900-01-01',
      phone: formValue.phone || '190001012',
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        const code = res.header.resultCode;
        const message = res.header.message;

        this.messageService.processResultCode(code, message);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.messageService.handleError(err);
      },
    });
  }

  get nameError(): string | null {
    return FormErrorsService.getNameError(this.registerForm.get('name'));
  }

  get mailError(): string | null {
    return FormErrorsService.getRegisterMailError(
      this.registerForm.get('mail')
    );
  }

  get passwordError(): string | null {
    return FormErrorsService.getRegisterPasswordError(
      this.registerForm.get('passwordGroup.password')
    );
  }
  get passwordGroupError(): string | null {
    return FormErrorsService.getPasswordGroupError(
      this.registerForm.get('passwordGroup')
    );
  }

  getAddressError(field: string): string | null {
    return FormErrorsService.getAddressFieldError(
      this.registerForm.get('address'),
      field
    );
  }
}
