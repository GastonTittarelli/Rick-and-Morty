import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../service/users.service';
import { MessageService } from '../../service/messages.service';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { FavoritesService } from '../../service/favorites.service';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { ActivatedRoute } from '@angular/router';

@Component({ selector: 'app-favorite-list', template: '' })
class MockFavoriteListComponent {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: any;
  let mockMessageService: any;
  let mockFavoritesService: any;
  let mockRickAndMortyService: any;
  let mockActivatedRoute: any;

  const mockUser = {
    name: 'Juan Perez',
    nickname: 'gg no jg',
    mail: 'juan@example.com',
    birthday: new Date(1990, 0, 1),
    location: 'Buenos Aires',
    profilePicture: 'https://example.com/img.jpg',
  };

  beforeEach(async () => {
    mockAuthService = {
      getUser: jasmine.createSpy('getUser').and.returnValue(mockUser),
      updateProfile: jasmine.createSpy('updateProfile').and.returnValue(
        of({
          header: { resultCode: 0, message: 'Success' },
          data: { user: mockUser },
        })
      ),
      getToken: jasmine.createSpy('getToken').and.returnValue('token'),
      saveSession: jasmine.createSpy('saveSession'),
    };

    mockMessageService = {
      processResultCode: jasmine.createSpy('processResultCode'),
      handleError: jasmine.createSpy('handleError'),
    };

    mockFavoritesService = {
      getFavorites: jasmine.createSpy('getFavorites').and.returnValue(of([])),
    };

    mockRickAndMortyService = {
      getCharacters: jasmine.createSpy('getCharacters').and.returnValue(of([])),
      getCharacter: jasmine.createSpy('getCharacter').and.returnValue(of({})),
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
        queryParamMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
      paramMap: of(new Map()),
      queryParamMap: of(new Map()),
      params: of({}),
      queryParams: of({}),
      data: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        ProfileComponent,
        MockFavoriteListComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: RickAndMortyService, useValue: mockRickAndMortyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debería cargar el usuario desde AuthService', () => {
      expect(component.user).toEqual(mockUser);
    });

    it('debería inicializar el formulario con los datos del usuario', () => {
      const form = component.profileForm;
      expect(form.value.nickname).toBe(mockUser.nickname);
      expect(form.value.profilePicture).toBe(mockUser.profilePicture);
      expect(form.value.location).toBe(mockUser.location);
    });
  });

  describe('View mode', () => {
    it('"debería mostrar la información del perfil cuando no se está editando', () => {
      component.isEditing = false;
      fixture.detectChanges();
      const nicknameEl = fixture.debugElement.query(
        By.css('.profile-info p:nth-child(2)')
      );
      expect(nicknameEl.nativeElement.textContent).toContain(mockUser.nickname);
    });

    it('debería cambiar al modo edición cuando se hace click en el botón Editar', () => {
      component.isEditing = false;
      fixture.detectChanges();
      const editBtn = fixture.debugElement.query(By.css('button'));
      editBtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.isEditing).toBeTrue();
    });

    it('debería renderizar el componente FavoriteList', () => {
      const favoriteListEl = fixture.debugElement.query(
        By.css('app-favorite-list')
      );
      expect(favoriteListEl).toBeTruthy();
    });

    it('debería mostrar la fecha de nacimiento formateada', () => {
      const birthdayEl = fixture.debugElement.query(
        By.css('.profile-info p:nth-child(4)')
      ).nativeElement;
      expect(birthdayEl.textContent).toContain('January 1, 1990');
    });
  });

  describe('Edit mode form validations', () => {
    beforeEach(() => {
      component.isEditing = true;
      fixture.detectChanges();
    });

    it('debería mostrar un error en el nickname si es muy corto (menos de 3 caracteres)', () => {
      const nicknameCtrl = component.profileForm.get('nickname');
      nicknameCtrl!.setValue('ab');
      nicknameCtrl!.markAsDirty();
      fixture.detectChanges();
      expect(component.nicknameError).toContain('at least 3 characters');
    });

    it('debería mostrar un error en el nickname si es muy largo (más de 15 caracteres)', () => {
      const nicknameCtrl = component.profileForm.get('nickname');
      nicknameCtrl!.setValue('a'.repeat(16));
      nicknameCtrl!.markAsDirty();
      fixture.detectChanges();
      expect(component.nicknameError).toContain('cannot exceed 15 characters');
    });

    it('debería mostrar un error en el profilePicture si no es una URL válida', () => {
      const ctrl = component.profileForm.get('profilePicture');
      ctrl!.setValue('not-a-url');
      ctrl!.markAsDirty();
      fixture.detectChanges();
      expect(component.profilePictureError).toContain(
        'must be a valid image URL'
      );
    });

    it('debería mostrar un error en la ubicación si es muy corta (menos de 3 caracteres)', () => {
      const ctrl = component.profileForm.get('location');
      ctrl!.setValue('ab');
      ctrl!.markAsDirty();
      fixture.detectChanges();
      expect(component.locationError).toContain('at least 3 characters');
    });

    it('debería retornar null para nicknameError si el campo no ha sido tocado', () => {
      const ctrl = component.profileForm.get('nickname')!;
      ctrl.setValue('ValidName');
      expect(component.nicknameError).toBeNull();
    });
  });

  describe('Form submission', () => {
    beforeEach(() => (component.isEditing = true));

    it('no debería enviarse si el campo nickname tiene entre 1 y 2 caracteres', () => {
      const nicknameCtrl = component.profileForm.get('nickname');
      nicknameCtrl!.setValue('ab');
      nicknameCtrl!.markAsTouched();
      nicknameCtrl!.markAsDirty();

      fixture.detectChanges();

      expect(component.profileForm.invalid).toBeTrue();
      expect(nicknameCtrl!.hasError('minlength')).toBeTrue();

      component.onSubmit();

      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('no debería enviarse si el campo nickname tiene más de 15 caracteres', () => {
      const nicknameCtrl = component.profileForm.get('nickname');
      nicknameCtrl!.setValue('a'.repeat(16));
      nicknameCtrl!.markAsTouched();
      nicknameCtrl!.markAsDirty();

      fixture.detectChanges();

      expect(component.profileForm.invalid).toBeTrue();
      expect(nicknameCtrl!.hasError('maxlength')).toBeTrue();

      component.onSubmit();

      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('debería enviar un formulario válido y actualizar el usuario', fakeAsync(() => {
      component.profileForm.patchValue({
        nickname: 'Nuevo',
        profilePicture: 'https://example.com/new.jpg',
        location: 'Cordoba',
      });
      component.onSubmit();
      tick();
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockAuthService.saveSession).toHaveBeenCalled();
      expect(component.isEditing).toBeFalse();
      expect(mockMessageService.processResultCode).toHaveBeenCalledWith(
        0,
        'Success'
      );
    }));

    it('debería manejar el error de actualización', fakeAsync(() => {
      mockAuthService.updateProfile.and.returnValue(
        throwError(() => new Error('fail'))
      );
      component.onSubmit();
      tick();
      expect(mockMessageService.handleError).toHaveBeenCalled();
    }));

    it('no debería enviarse si la profilePicture no es una URL de imagen válida', () => {
      const pictureCtrl = component.profileForm.get('profilePicture');
      pictureCtrl!.setValue('not-a-valid-image-url');
      pictureCtrl!.markAsTouched();
      pictureCtrl!.markAsDirty();

      fixture.detectChanges();

      expect(component.profileForm.invalid).toBeTrue();
      expect(pictureCtrl!.hasError('pattern')).toBeTrue();

      component.onSubmit();

      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('no debería enviarse si la location tiene entre 1 y 2 caracteres', () => {
      const locationCtrl = component.profileForm.get('location');
      locationCtrl!.setValue('ab');
      locationCtrl!.markAsTouched();
      locationCtrl!.markAsDirty();

      fixture.detectChanges();

      expect(component.profileForm.invalid).toBeTrue();
      expect(locationCtrl!.hasError('minlength')).toBeTrue();

      component.onSubmit();

      expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    });

    it('debería enviarse la url con campos opcionales vacíos', fakeAsync(() => {
      component.profileForm.patchValue({
        nickname: '',
        profilePicture: 'https://example.com/valid.jpg',
        location: '',
      });

      fixture.detectChanges();

      expect(component.profileForm.valid).toBeTrue();

      component.onSubmit();
      tick();

      expect(mockAuthService.updateProfile).toHaveBeenCalled();
    }));

    it('debería enviarse la url con nickname vacío pero location válida', fakeAsync(() => {
      component.profileForm.patchValue({
        nickname: '',
        profilePicture: 'https://example.com/img.png',
        location: 'Buenos Aires',
      });

      fixture.detectChanges();

      expect(component.profileForm.valid).toBeTrue();

      component.onSubmit();
      tick();

      expect(mockAuthService.updateProfile).toHaveBeenCalled();
    }));

    it('debería enviarse la url con location vacía pero nickname válido', fakeAsync(() => {
      component.profileForm.patchValue({
        nickname: 'Juanito',
        profilePicture: 'https://example.com/avatar.jpg',
        location: '',
      });

      fixture.detectChanges();

      expect(component.profileForm.valid).toBeTrue();

      component.onSubmit();
      tick();

      expect(mockAuthService.updateProfile).toHaveBeenCalled();
    }));

    it('debería enviarse la url sin cambios', fakeAsync(() => {
      component.isEditing = true;
      fixture.detectChanges();
      component.onSubmit();
      tick();
      expect(mockAuthService.updateProfile).toHaveBeenCalled();
    }));
  });

  describe('Image handling', () => {
    it('debería establecer imageError en true en onImageError', () => {
      component.imageError = false;
      component.onImageError();
      expect(component.imageError).toBeTrue();
    });

    it('debería restablecer imageError en onImageInputChange', () => {
      component.imageError = true;
      component.onImageInputChange();
      expect(component.imageError).toBeFalse();
    });

    it('debería usar la imagen de fallback en onViewImageError', () => {
      const event = { target: { src: '', dataset: {} } } as any;
      component.onViewImageError(event);
      expect(event.target.src).toContain('https://ui-avatars.com/api/?name=');
      expect(event.target.dataset['fallbackUsed']).toBe('true');
    });

    it('debería mostrar la imagen de fallback después de una entrada de profilePicture inválida', () => {
      component.isEditing = true;
      fixture.detectChanges();

      const ctrl = component.profileForm.get('profilePicture')!;
      ctrl.setValue('invalid-url');
      component.onImageError();
      fixture.detectChanges();

      const imgEl = fixture.debugElement.query(
        By.css('.profile-card img.profile-img')
      ).nativeElement as HTMLImageElement;
      expect(imgEl.src).toContain(
        'https://ui-avatars.com/api/?name=' +
          encodeURIComponent(component.user.name)
      );
    });

    it('debería no reemplazar la imagen si ya se utilizó la imagen de fallback', () => {
      const event = {
        target: { src: '', dataset: { fallbackUsed: 'true' } },
      } as any;
      component.onViewImageError(event);
      expect(event.target.src).toBe('');
    });
  });

  describe('Buttons', () => {
    it('debería cancelar la edición', () => {
      component.isEditing = true;
      fixture.detectChanges();
      const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[1];
      cancelBtn.nativeElement.click();
      fixture.detectChanges();
      expect(component.isEditing).toBeFalse();
    });
  });

  it('debería mostrar el botón "Editar perfil" solo cuando no se está editando', () => {
    component.isEditing = false;
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'));
    expect(btn.nativeElement.textContent).toContain('Editar perfil');

    component.isEditing = true;
    fixture.detectChanges();
    const editBtn = fixture.debugElement.query(By.css('button'));
    expect(editBtn.nativeElement.textContent).not.toContain('Editar perfil');
  });
});
