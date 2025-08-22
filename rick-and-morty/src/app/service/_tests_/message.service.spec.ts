import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MessageService, AlertMessage } from '../messages.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit message via showMessage', (done) => {
    const testMessage: AlertMessage = { type: 'success', text: 'Test' };
    service.alert$.subscribe(msg => {
      if (msg) {
        expect(msg).toEqual(jasmine.objectContaining({ type: 'success', text: 'Test' }));
        done();
      }
    });
    service.showMessage(testMessage.type, testMessage.text);
  });

  it('should emit message and clear after timeout via showMessageWithTimeout', fakeAsync(() => {
    const testMessage: AlertMessage = { type: 'warning', text: 'Timeout Test' };
    let emitted: AlertMessage | null = null;

    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.showMessageWithTimeout(testMessage.type, testMessage.text, 1000);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'warning', text: 'Timeout Test' }));

    tick(1000);
    expect(emitted).toBeNull();
  }));

  it('should clear message manually', (done) => {
    service.showMessage('info', 'Info test');
    service.alert$.subscribe(msg => {
      if (msg === null) {
        expect(msg).toBeNull();
        done();
      }
    });
    service.clear();
  });

  it('should processResultCode correctly for known codes', fakeAsync(() => {
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

  it('should handle backend error with resultCode', fakeAsync(() => {
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

  it('should handle backend error without resultCode', fakeAsync(() => {
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

  it('should handle backend error without any message', fakeAsync(() => {
    const errorResponse = { error: {} };

    let emitted: AlertMessage | null = null;
    service.alert$.subscribe(msg => emitted = msg as AlertMessage | null);

    service.handleError(errorResponse);
    expect(emitted).toEqual(jasmine.objectContaining({ type: 'danger', text: 'Server error, try again later' }));
    tick(2000);
    expect(emitted).toBeNull();
  }));

});