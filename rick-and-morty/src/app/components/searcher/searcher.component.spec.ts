import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearcherComponent } from './searcher.component';

describe('SearcherComponent', () => {
  let component: SearcherComponent;
  let fixture: ComponentFixture<SearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SearcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('debería tener searchTerm vacío inicialmente', () => {
      expect(component.searchTerm).toBe('');
    });

    it('debería renderizar el input con valor vacío', () => {
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.value).toBe('');
    });

    it('debería renderizar el botón de búsqueda', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.textContent.trim()).toBe('Search');
    });
  });

  describe('Input functionality', () => {
    it('debería actualizar searchTerm cuando cambia el valor del input', fakeAsync(() => {
      const input = fixture.debugElement.query(By.css('input'));
      const testValue = 'test search';

      input.nativeElement.value = testValue;
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();

      expect(component.searchTerm).toBe(testValue);
    }));

    it('debería reflejar el valor de searchTerm en el input', fakeAsync(() => {
      component.searchTerm = 'angular';
      fixture.detectChanges();
      tick();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.value).toBe('angular');
    }));
  });

  describe('onInputChange()', () => {
    it('debería emitir una cadena vacía cuando searchTerm está vacío', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = '';

      component.onInputChange();

      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('no debería emitir cuando searchTerm no está vacío', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = 'test';

      component.onInputChange();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debería emitir una cadena vacía si searchTerm tiene texto válido con espacios', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = ' valid ';
      component.onInputChange();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit()', () => {
    it('debería emitir el término de búsqueda sin espacios', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = '  test  ';

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith('test');
    });

    it('debería emitir una cadena vacía si searchTerm contiene solo espacios', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = '   ';
      component.onSubmit();
      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('debería prevenir el comportamiento por defecto si se proporciona un evento', () => {
      const event = new Event('submit');
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      component.onSubmit(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('debería funcionar sin el parámetro del evento', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = 'test';

      expect(() => component.onSubmit()).not.toThrow();
      expect(emitSpy).toHaveBeenCalledWith('test');
    });
  });

  describe('clearSearch()', () => {
    it('debería limpiar searchTerm y emitir una cadena vacía', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = 'previous value';

      component.clearSearch();

      expect(component.searchTerm).toBe('');
      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('debería evitar la acción por defecto del evento al limpiar la búsqueda', () => {
      const event = new Event('click');
      const preventDefaultSpy = spyOn(event, 'preventDefault');

      component.clearSearch(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Template interactions', () => {
    it('debería llamar a onSubmit cuando se envía el formulario', () => {
      const onSubmitSpy = spyOn(component, 'onSubmit');
      const form = fixture.debugElement.query(By.css('form'));

      form.triggerEventHandler('submit', new Event('submit'));

      expect(onSubmitSpy).toHaveBeenCalled();
    });

    it('debería llamar a onInputChange cuando cambia el input', () => {
      const onInputChangeSpy = spyOn(component, 'onInputChange');
      const input = fixture.debugElement.query(By.css('input'));

      input.triggerEventHandler('input', { target: { value: 'test' } });

      expect(onInputChangeSpy).toHaveBeenCalled();
    });

    it('debería emitir el evento de búsqueda al escribir y luego enviar el formulario', fakeAsync(() => {
      const emitSpy = spyOn(component.search, 'emit');
      const input = fixture.debugElement.query(By.css('input'));
      const form = fixture.debugElement.query(By.css('form'));
      input.nativeElement.value = 'angular';
      input.nativeElement.dispatchEvent(new Event('input'));
      tick();
      form.triggerEventHandler('submit', new Event('submit'));
      expect(emitSpy).toHaveBeenCalledWith('angular');
    }));
  });

  describe('Output events', () => {
    it('debería emitir el evento de búsqueda con el valor correcto al enviar', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = 'angular testing';

      component.onSubmit();

      expect(emitSpy).toHaveBeenCalledWith('angular testing');
    });

    it('debería emitir el evento de búsqueda al cambiar el input cuando el término está vacío', () => {
      const emitSpy = spyOn(component.search, 'emit');
      component.searchTerm = '';

      component.onInputChange();

      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });
});
