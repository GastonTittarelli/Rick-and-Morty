import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../service/messages.service';
import { FormErrorsService } from '../../service/form-error.service';
import { FavoriteListComponent } from '../favorite-list/favorite-list.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FavoriteListComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any;
  profileForm!: FormGroup;
  isEditing = false;
  imageError = false;
  imageLoadFailed = false;
  

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.profileForm = this.fb.group({
      nickname: [
        this.user.nickname || '',
        [
          FormErrorsService.conditionalMinLength(3),
          FormErrorsService.conditionalMaxLength(15),
        ],
      ],
      profilePicture: [
        this.user.profilePicture || '',
        [
          Validators.pattern(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|bmp))$/i),
        ],
      ],
      location: [
        this.user.location || '',
        [
          FormErrorsService.conditionalMinLength(3),
          FormErrorsService.conditionalMaxLength(50),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (res) => {
        const code = res.header.resultCode;
        const message = res.header.error || res.header.message;

        const updatedUser = res.data.user;
        const token = this.authService.getToken();
        this.authService.saveSession(token!, updatedUser, true);
        this.user = updatedUser;
        this.isEditing = false;

        this.messageService.processResultCode(code, message);
      },
      error: (err) => {
        this.messageService.handleError(err);
      },
    });
  }

  onImageError() {
    this.imageError = true;
  }
  onImageInputChange() {
    this.imageError = false;
  }

  onViewImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  // Para evitar un loop infinito
  if (!img.dataset['fallbackUsed']) {
    img.dataset['fallbackUsed'] = 'true';
    img.src = 'https://ui-avatars.com/api/?name=' + this.user.name;
  }
}

get nicknameError(): string | null {
  const control = this.profileForm.get('nickname');
  if (!control) return null;
  if (control.touched || control.dirty) {
    if (control.hasError('minlength')) return 'Nickname must be at least 3 characters.';
    if (control.hasError('maxlength')) return 'Nickname cannot exceed 15 characters.';
  }
  return null;
}

get profilePictureError(): string | null {
  const control = this.profileForm.get('profilePicture');
  if (!control) return null;
  if (control.touched || control.dirty) {
    if (control.hasError('pattern')) return 'Profile picture must be a valid image URL.';
  }
  return null;
}

get locationError(): string | null {
  const control = this.profileForm.get('location');
  if (!control) return null;
  if (control.touched || control.dirty) {
    if (control.hasError('minlength')) return 'Location must be at least 3 characters.';
    if (control.hasError('maxlength')) return 'Location cannot exceed 50 characters.';
  }
  return null;
}
}
