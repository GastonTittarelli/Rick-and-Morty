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
  // Observable para que los componentes se suscriban y reciban mensajes
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  
  alert$ = this.alertSubject.asObservable();
  
  private timeoutId: any;
  // Método para enviar mensajes
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
  // Método para limpiar mensajes (ej: al navegar o después de x segundos)
  clear() {
    this.alertSubject.next(null);
  }

  // Método para interpretar errores del backend y lanzar mensajes
  handleError(errorResponse: any) {
    console.log('handleError', errorResponse);
    const serverError = errorResponse?.error;

    if (serverError && serverError.header) {
      switch (serverError.header.resultCode) {
        case 2:
          this.showMessageWithTimeout('warning', serverError.header.error || 'Mail or password is empty');
          break;
        case 3:
          this.showMessageWithTimeout('danger', 'User not found');
          break;
        case 4:
          this.showMessageWithTimeout('warning', 'Invalid password');
          break;
        default:
          this.showMessageWithTimeout('danger', 'Server error, try again later');
      }
    } else {
      
      const generic = serverError?.message || 'Server error, try again later';
    this.showMessageWithTimeout('danger', generic);
    }
  }
}
