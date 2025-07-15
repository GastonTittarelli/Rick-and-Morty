import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'warning' | 'danger' | 'info';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  alert$ = this.alertSubject.asObservable();
  private timeoutId: any;

  showMessage(type: AlertMessage['type'], text: string) {
    this.alertSubject.next({ type, text });
  }

  showMessageWithTimeout(type: AlertMessage['type'], text: string, duration: number = 2000) {
    this.showMessage(type, text);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.clear();
      this.timeoutId = null;
    }, duration);
  }

  clear() {
    this.alertSubject.next(null);
  }

  processResultCode(resultCode: number, backendMessage?: string): void {
    switch (resultCode) {
      case 0:
      case 200:
        this.showMessageWithTimeout('success', backendMessage || 'Authenticated user');
        break;
      case 1:
        this.showMessageWithTimeout('warning', backendMessage || 'Mail already Registered');
        break;
      case 3:
        this.showMessageWithTimeout('warning', backendMessage || 'User not found');
        break;
      case 4:
        this.showMessageWithTimeout('warning', backendMessage || 'Invalid password');
        break;
      default:
        this.showMessageWithTimeout('danger', backendMessage || 'Unknown error');
        break;
    }
  }

  /* Método para manejar errores del backend */
  handleError(errorResponse: any): void {
    const serverError = errorResponse?.error;
    const resultCode = serverError?.header?.resultCode;
    const backendMessage = serverError?.header?.error || serverError?.message;

    if (resultCode !== undefined) {
      this.processResultCode(resultCode, backendMessage);
    } else {
      this.showMessageWithTimeout('danger', backendMessage || 'Server error, try again later');
    }
  }
}
