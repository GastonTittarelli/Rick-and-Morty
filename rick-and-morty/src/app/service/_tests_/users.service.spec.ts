import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../users.service';
import { LoginResponse, RegisterRequest, RegisterResponse } from '../../shared/interfaces/auth-interfaces';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const dummyToken = 'dummy-token';
  const dummyUser = {
    id: '1',
    role: 'user',
    name: 'User',
    mail: 'test@mail.com',
    address: {
      street: 'Street 1',
      location: 'Loc',
      city: 'City',
      country: 'Country',
      cp: '1234'
    },
    birthday: '2000-01-01',
    phone: '12345678'
  };
  const baseUrl = 'https://rick-and-morty-qxca.onrender.com/user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and return response', () => {
    const mockResponse: LoginResponse = {
      header: { resultCode: 200 },
      data: {
        user: dummyUser,
        token: dummyToken
      }
    };

    service.login('test@mail.com', 'password').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ mail: 'test@mail.com', password: 'password' });
    req.flush(mockResponse);
  });

  it('should register a new user', () => {
    const userData: RegisterRequest = {
      name: 'User',
      mail: 'test@mail.com',
      password: 'password',
      address: {
        street: 'Street 1',
        location: 'Loc',
        city: 'City',
        country: 'Country',
        cp: '1234'
      },
      birthday: '2000-01-01',
      phone: '12345678'
    };

    const mockResponse: RegisterResponse = {
      header: { resultCode: 200 },
      data: {
        user: {
          ...dummyUser,
          date: '2025-08-22'
        }
      }
    };

    service.register(userData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(mockResponse);
  });

  it('should save session in localStorage when remember is true', () => {
    service.saveSession(dummyToken, dummyUser, true);
    expect(localStorage.getItem('token')).toBe(dummyToken);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(dummyUser));
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('should save session in sessionStorage when remember is false', () => {
    service.saveSession(dummyToken, dummyUser, false);
    expect(sessionStorage.getItem('token')).toBe(dummyToken);
    expect(sessionStorage.getItem('user')).toBe(JSON.stringify(dummyUser));
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('token', dummyToken);
    sessionStorage.setItem('token', dummyToken);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });

  it('should return correct isLoggedIn value', () => {
    expect(service.isLoggedIn()).toBeFalse();
    localStorage.setItem('token', dummyToken);
    expect(service.isLoggedIn()).toBeTrue();
    localStorage.removeItem('token');
    sessionStorage.setItem('token', dummyToken);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return token from storage', () => {
    expect(service.getToken()).toBeNull();
    localStorage.setItem('token', dummyToken);
    expect(service.getToken()).toBe(dummyToken);
    localStorage.removeItem('token');
    sessionStorage.setItem('token', dummyToken);
    expect(service.getToken()).toBe(dummyToken);
  });

  it('should return user from storage', () => {
    expect(service.getUser()).toBeNull();
    localStorage.setItem('user', JSON.stringify(dummyUser));
    expect(service.getUser()).toEqual(dummyUser);
    localStorage.removeItem('user');
    sessionStorage.setItem('user', JSON.stringify(dummyUser));
    expect(service.getUser()).toEqual(dummyUser);
  });

  it('should get profile with Authorization header', () => {
    localStorage.setItem('token', dummyToken);
    const mockProfile = { profile: 'data' };

    service.getProfile().subscribe(res => {
      expect(res).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${baseUrl}/profile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    req.flush(mockProfile);
  });

  it('should update profile with Authorization header', () => {
    localStorage.setItem('token', dummyToken);
    const updateData = { name: 'Updated User' };
    const mockResponse = { updated: true };

    service.updateProfile(updateData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/update`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

});
