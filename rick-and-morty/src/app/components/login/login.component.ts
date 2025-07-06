import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../service/messages.service';
import { Router, RouterLink } from '@angular/router';
import { FormErrorsService } from '../../service/form-error.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgbModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],
      rememberMe: [false],
    });
    this.loginForm.valueChanges.subscribe(() => {
      this.messageService.clear();
    });

    // Recordar correo
    const rememberedMail: string | null = localStorage.getItem('rememberedMail');
    if (rememberedMail !== null) {
      this.loginForm.patchValue({
        mail: rememberedMail,
        rememberMe: true,
      });
    }

    this.loginForm.valueChanges.subscribe(() => {
      this.messageService.clear();
    });
  }
  

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { mail, password, rememberMe } = this.loginForm.value;

    this.authService.login(mail, password).subscribe({
      next: (res) => {
        const code = res.header.resultCode;
        const message = res.header.error || res.header.message;

        if (code === 0) {
          this.authService.saveSession(
            res.data.token,
            res.data.user,
            rememberMe
          );
          // Guardar o eliminar mail recordado
          if (rememberMe) {
            localStorage.setItem('rememberedMail', mail);
          } else {
            localStorage.removeItem('rememberedMail');
          }
          this.router.navigate(['/home/characters']);
        }

        // Siempre mostrar mensaje del backend
        this.messageService.processResultCode(code, message);
      },
      error: (err) => {
        this.messageService.handleError(err);
      },
    });
  }

  get mailErrors(): string | null {
    return FormErrorsService.getMailError(this.loginForm.get('mail'));
  }

  get passwordErrors(): string | null {
    return FormErrorsService.getPasswordError(this.loginForm.get('password'));
  }
}
