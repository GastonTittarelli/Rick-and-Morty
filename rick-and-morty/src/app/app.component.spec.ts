import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from './service/messages.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AlertMessage } from './service/messages.service';

// Mock del servicio MessageService
class MockMessageService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  alert$ = this.alertSubject.asObservable();

  // Método para simular el envío de alertas
  setAlert(alert: AlertMessage | null) {
    this.alertSubject.next(alert);
  }
}

// Mock del RouterOutlet
class MockRouterOutlet {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let messageService: MockMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule],
      providers: [
        { provide: MessageService, useClass: MockMessageService },
        { provide: RouterOutlet, useClass: MockRouterOutlet },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(
      MessageService
    ) as unknown as MockMessageService;
    fixture.detectChanges();
  });

  it('debe crear el componente App', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener el título "mi-proyecto-angular"', () => {
    expect(component.title).toBe('mi-proyecto-angular');
  });

  it('debe inicializar alert$ desde MessageService', () => {
    expect(component.alert$).toBeDefined();
    expect(component.alert$).toEqual(messageService.alert$);
  });

  it('debe mostrar la alerta cuando alert$ emite un valor', fakeAsync(() => {
    // Simula la alerta de éxito
    const testAlert: AlertMessage = {
      type: 'success',
      text: 'Operación exitosa',
    };

    messageService.setAlert(testAlert);
    tick();
    fixture.detectChanges();

    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement).toBeTruthy();
    expect(alertElement.textContent).toContain('Operación exitosa');
    expect(alertElement.classList).toContain('alert-success');
  }));

  it('no debe mostrar la alerta cuando alert$ emite null', fakeAsync(() => {
    messageService.setAlert(null);
    tick();
    fixture.detectChanges();

    const alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement).toBeFalsy();
  }));

  it('debe aplicar la clase CSS correcta según el tipo de alerta', fakeAsync(() => {
    const testAlerts: AlertMessage[] = [
      { type: 'success', text: 'Éxito' },
      { type: 'danger', text: 'Error' },
      { type: 'warning', text: 'Advertencia' },
      { type: 'info', text: 'Información' },
    ];

    testAlerts.forEach((alert) => {
      messageService.setAlert(alert);
      tick();
      fixture.detectChanges();

      const alertElement = fixture.nativeElement.querySelector('.alert');
      expect(alertElement.classList).toContain(`alert-${alert.type}`);

      // Limpia para el siguiente test
      messageService.setAlert(null);
      tick();
      fixture.detectChanges();
    });
  }));

  it('debe manejar múltiples emisiones de alerta correctamente', fakeAsync(() => {
    // Primera alerta
    const firstAlert: AlertMessage = {
      type: 'success',
      text: 'Primera alerta',
    };
    messageService.setAlert(firstAlert);
    tick();
    fixture.detectChanges();

    let alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.textContent).toContain('Primera alerta');

    // Segunda alerta
    const secondAlert: AlertMessage = {
      type: 'danger',
      text: 'Segunda alerta',
    };
    messageService.setAlert(secondAlert);
    tick();
    fixture.detectChanges();

    alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement.textContent).toContain('Segunda alerta');
    expect(alertElement.classList).toContain('alert-danger');

    // Limpia el alerta
    messageService.setAlert(null);
    tick();
    fixture.detectChanges();

    alertElement = fixture.nativeElement.querySelector('.alert');
    expect(alertElement).toBeFalsy();
  }));

  it('debe contener el router-outlet', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
