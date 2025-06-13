import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertMessage, MessageService } from '../../service/auth-messages.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, NgbModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  alertMessage = '';
  alertType = '';
  alert$!: Observable<AlertMessage | null>;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.alert$ = this.messageService.alert$;
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  ]]
    });
    this.loginForm.valueChanges.subscribe(() => {
    this.messageService.clear();
  });
  }

  

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { mail, password } = this.loginForm.value;

    this.authService.login(mail, password).subscribe({
      next: (res) => {
        const code = res.header.resultCode;
        switch(code) {
          case 0: // éxito
            this.messageService.showMessageWithTimeout('success', res.header.message || 'Authenticated user', 2000);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.router.navigate(['/home/characters']);
            break;
          case 2:
            this.messageService.showMessageWithTimeout('warning', res.header.error || 'Validation error');
            break;
          case 3:
            this.messageService.showMessageWithTimeout('warning', 'User not found', 2000);
            break;
          case 4:
            this.messageService.showMessageWithTimeout('warning', 'Invalid password', 2000);
            break;
          default:
            this.messageService.showMessageWithTimeout('danger', 'Unknown error', 2000);
        }
      },
      error: (err) => {
        this.messageService.handleError(err);
      }
    });
  }
}
