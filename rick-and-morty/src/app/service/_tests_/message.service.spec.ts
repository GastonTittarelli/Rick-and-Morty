import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MessageService, AlertMessage } from '../messages.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('debe crearse el servicio de mensajes', () => {
    expect(service).toBeTruthy();
  });

  it('dado que se muestra un mensaje, cuando se llama a showMessage, entonces debe emitirse el mensaje con el tipo y texto correcto.', (done) => {
    const testMessage: AlertMessage = { type: 'success', text: 'Test' };
    service.alert$.subscribe(msg => {
      if (msg) {
        expect(msg).toEqual(jasmine.objectContaining({ type: 'success', text: 'Test' }));
        done();
      }
    });
    service.showMessage(testMessage.type, testMessage.text);
  });

  it('dado que se muestra un mensaje y se establece un tiempo de espera, cuando se llama a showMessageWithTimeout, entonces debe emitirse el mensaje y luego limpiarse después del tiempo de espera.', fakeAsync(() => {
    const testMessage: AlertMessage = { type: 'warning', text: 'Timeout Test' };
    let emitted: AlertMessage | null = null;

    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.showMessageWithTimeout(testMessage.type, testMessage.text, 1000);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'warning', text: 'Timeout Test' }));

    tick(1000);
    expect(emitted).toBeNull();
  }));

  it('dado que hay un mensaje mostrado, cuando se limpia manualmente con clear, entonces debe emitirse null y detenerse la suscripción.', (done) => {
    service.showMessage('info', 'Info test');
    service.alert$.subscribe(msg => {
      if (msg === null) {
        expect(msg).toBeNull();
        done();
      }
    });
    service.clear();
  });

  it('dado que se procesa un código de resultado conocido, cuando se llama a processResultCode, entonces debe emitirse el mensaje correspondiente y desaparecer después del timeout', fakeAsync(() => {
    const codes = [
      { code: 0, expectedType: 'success', expectedText: 'Success' },
      { code: 200, expectedType: 'success', expectedText: 'Success' },
      { code: 1, expectedType: 'warning', expectedText: 'Operation not allowed' },
      { code: 3, expectedType: 'warning', expectedText: 'Invalid request' },
      { code: 4, expectedType: 'warning', expectedText: 'Resource not found' },
      { code: 999, expectedType: 'danger', expectedText: 'Unknown error' },
    ];

    codes.forEach(({ code, expectedType, expectedText }) => {
      let emitted: AlertMessage | null = null;
      service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

      service.processResultCode(code);
      expect(emitted).toEqual(jasmine.objectContaining({ type: expectedType, text: expectedText }));
      tick(2000);
      expect(emitted).toBeNull();
    });
  }));

  it('dado que ocurre un error desde backend con un resultCode, cuando se maneja el error, entonces debe emitirse el mensaje de error proporcionado y desaparecer después del timeout.', fakeAsync(() => {
    const errorResponse = {
      error: {
        header: {
          resultCode: 1,
          error: 'Custom backend message'
        }
      }
    };

    let emitted: AlertMessage | null = null;
    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.handleError(errorResponse);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'warning', text: 'Custom backend message' }));
    tick(2000);
    expect(emitted).toBeNull();
  }));

  it('dado que ocurre un error desde backend sin resultCode pero con un mensaje, cuando se maneja el error, entonces debe emitirse un mensaje de tipo danger con ese texto', fakeAsync(() => {
    const errorResponse = {
      error: {
        message: 'Server failed'
      }
    };

    let emitted: AlertMessage | null = null;
    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.handleError(errorResponse);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'danger', text: 'Server failed' }));
    tick(2000);
    expect(emitted).toBeNull();
  }));

  it('dado que ocurre un error desde backend sin resultCode ni mensaje, cuando se maneja el error, entonces debe emitirse un mensaje genérico indicando error de servidor', fakeAsync(() => {
    const errorResponse = { error: {} };

    let emitted: AlertMessage | null = null;
    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.handleError(errorResponse);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'danger', text: 'Server error, try again later' }));
    tick(2000);
    expect(emitted).toBeNull();
  }));

});