import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any;
  profileForm!: FormGroup;
  isEditing = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.profileForm = this.fb.group({
      nickname: [this.user.nickname || ''],
      profilePicture: [this.user.profilePicture || ''],
      location: [this.user.location || ''],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        alert('Perfil actualizado correctamente');
        const updatedUser = res.data.user;
        const token = this.authService.getToken();
        this.authService.saveSession(token!, updatedUser, true);
        this.user = updatedUser;
        this.isEditing = false;
      },
      error: () => {
        alert('Error al actualizar el perfil');
      },
    });
  }
}
