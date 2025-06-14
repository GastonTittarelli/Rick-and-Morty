import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/users.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../service/auth-messages.service';
import { Router, RouterLink } from '@angular/router';


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
        const message = res.header.error || res.header.message;

      if (code === 0) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.router.navigate(['/home/characters']);
      }

      // Siempre mostrar mensaje del backend
      this.messageService.processResultCode(code, message);
    },
    error: (err) => {
      this.messageService.handleError(err);
    }
  });
}
}
