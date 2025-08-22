import { PaginatorComponent } from './paginator.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let emitSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.totalPages = 42;
    component.currentPage = 1;
    emitSpy = spyOn(component.pageChange, 'emit');
    fixture.detectChanges();
  });

  it('debe crear el componente Paginator', () => {
    expect(component).toBeTruthy();
  });

  describe('Input bindings', () => {
    it('debe renderizar el botón correspondiente a currentPage con la clase active', () => {
      component.currentPage = 3;
      fixture.detectChanges();
      const activeItem = fixture.debugElement.query(
        By.css('.page-item.active')
      );
      expect(activeItem.nativeElement.textContent).toContain('3');
    });

    it('debe renderizar los botones de paginación acorde al totalPages y currentPages', () => {
      component.totalPages = 22;
      component.currentPage = 1;
      fixture.detectChanges();

      const pageItems = fixture.debugElement.queryAll(By.css('.page-item'));

      // Filtra solo los que tienen un número válido
      const numericPages = pageItems.filter((item) => {
        const link = item.query(By.css('a.page-link'));
        const text = link?.nativeElement.textContent.trim();
        return !!text && /^\d+$/.test(text);
      });

      // Verifica que los números visibles estén en el rango correcto
      const pageNumbers = numericPages.map((item) => {
        return item
          .query(By.css('a.page-link'))
          .nativeElement.textContent.trim();
      });

      pageNumbers.forEach((num) => {
        expect(Number(num)).toBeGreaterThanOrEqual(1);
        expect(Number(num)).toBeLessThanOrEqual(component.totalPages);
        // console.log(`Número de página: ${num}`);
      });
    });
  });

  describe('changePage()', () => {
    it('debe actualizar la página actual llamando a pageChange cuando se solicita una página válida', () => {
      component.currentPage = 1;
      component.changePage(2);
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('no debe actualizar si se solicita la misma página', () => {
      component.currentPage = 2;
      component.changePage(2);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debe emitir nada cuando la página es menor que 1', () => {
      component.changePage(0);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debe emitir nada cuando la página excede totalPages', () => {
      component.changePage(43);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('getPageNumbers()', () => {
    it('debe retornar el rango correcto para un pequeño número de páginas', () => {
      component.totalPages = 5;
      component.currentPage = 1;

      const pageNumbers = component.getPageNumbers();

      // Se verifica que tenga todos los números dentro del rango válido
      pageNumbers.forEach((p) => {
        if (typeof p === 'number') {
          expect(p).toBeGreaterThanOrEqual(1);
          expect(p).toBeLessThanOrEqual(component.totalPages);
        } else {
          // p es '...' → no hacemos nada
          expect(p).toBe('...');
        }
      });

      // prueba el primer y último elemento
      expect(pageNumbers[0]).toBe(1);
      expect(pageNumbers[pageNumbers.length - 1]).toBe(5);
    });

    it('debe retornar el rango correcto con puntos suspensivos al inicio', () => {
      component.totalPages = 10;
      component.currentPage = 8;
      expect(component.getPageNumbers()).toEqual([1, '...', 6, 7, 8, 9, 10]);
    });

    it('debe retornar el rango correcto con puntos suspensivos al final', () => {
      component.totalPages = 10;
      component.currentPage = 3;
      expect(component.getPageNumbers()).toEqual([1, 2, 3, 4, 5, '...', 10]);
    });

    it('debe retornar el rango correcto con puntos suspensivos a ambos lados', () => {
      component.totalPages = 20;
      component.currentPage = 10;
      expect(component.getPageNumbers()).toEqual([
        1,
        '...',
        8,
        9,
        10,
        11,
        12,
        '...',
        20,
      ]);
    });

    it('debe manejar una sola página', () => {
      component.totalPages = 1;
      expect(component.getPageNumbers()).toEqual([1]);
    });
  });

  describe('onPageClick()', () => {
    it('debe llamar a changePage para la entrada numérica', () => {
      spyOn(component, 'changePage');
      component.onPageClick(3);
      expect(component.changePage).toHaveBeenCalledWith(3);
    });

    it('no debe llamar a changePage para la entrada de puntos suspensivos', () => {
      spyOn(component, 'changePage');
      component.onPageClick('...');
      expect(component.changePage).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('debe renderizar el botón "Previous" deshabilitado en la primera página', () => {
      component.currentPage = 1;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(
        By.css('.page-item:first-child')
      );
      expect(prevButton.nativeElement.classList).toContain('disabled');
    });

    it('debe renderizar el botón "Next" deshabilitado en la última página', () => {
      component.currentPage = 42;
      component.totalPages = 42;
      fixture.detectChanges();
      const nextButton = fixture.debugElement.query(
        By.css('.page-item:last-child')
      );
      expect(nextButton.nativeElement.classList).toContain('disabled');
    });

    it('debe renderizar los puntos suspensivos correctamente', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      fixture.detectChanges();
      const ellipsis = fixture.debugElement.queryAll(By.css('.page-link'))[2];
      expect(ellipsis.nativeElement.textContent).toBe('...');
    });
  });

  describe('User interactions', () => {
    it('debe emitir el cambio de página cuando se hace click en Previous', () => {
      component.currentPage = 2;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(
        By.css('.page-link:first-child')
      );
      prevButton.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith(1);
    });

    it('debe emitir el cambio de página cuando se hace click en Next', () => {
      component.currentPage = 1;
      fixture.detectChanges();

      const nextButton = fixture.debugElement.query(
        By.css('.page-item:last-child a.page-link')
      );
      nextButton.nativeElement.click();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('debe emitir el cambio de página cuando se hace click en el número de página', () => {
      component.totalPages = 5;
      fixture.detectChanges();
      const pageButtons = fixture.debugElement.queryAll(
        By.css('.page-link')
      )[2];
      pageButtons.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('no debe emitir nada cuando se hace clic en los puntos suspensivos al inicio, medio o final', () => {
      component.totalPages = 20;
      component.currentPage = 10;
      fixture.detectChanges();

      const pageLinks = fixture.debugElement.queryAll(By.css('.page-link'));
      const ellipsisLinks = pageLinks.filter(
        (link) => link.nativeElement.textContent.trim() === '...'
      );

      // Verifico que realmente existan puntos suspensivos
      expect(ellipsisLinks.length).toBeGreaterThan(0);

      ellipsisLinks.forEach((link) => link.nativeElement.click());

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('debe tener un aria-label adecuado en el elemento nav', () => {
      // Atributo que describe un elemento para lectores de pantalla. Sirve para que personas con discapacidad visual puedan entender qué hace ese elemento.
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe(
        'Characters page navigation'
      );
    });

    it('debe tener aria-current="page" en el botón activo de la paginación', () => {
      component.currentPage = 6;
      fixture.detectChanges();

      const activeButton = fixture.debugElement.query(
        By.css('.page-item.active a.page-link')
      );
      expect(activeButton.nativeElement.getAttribute('aria-current')).toBe(
        'page'
      );
      //convención: aria-current puede tomar varios valores predefinidos para indicar el "ítem actual". "page" → pagina actual.
    });

    it('debe tener aria-disabled="true" el boton de Previous cuando se está en la primera página, al igual que el boton de Next cuando se está en la última página', () => {
      // convención:aria-disabled="true". Informa a los lectores de pantalla que ese enlace está inhabilitado.
      // Previous
      component.currentPage = 1;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(
        By.css('.page-item:first-child a.page-link')
      );
      expect(prevButton.nativeElement.getAttribute('aria-disabled')).toBe(
        'true'
      );

      // Next
      component.currentPage = component.totalPages;
      fixture.detectChanges();
      const nextButton = fixture.debugElement.query(
        By.css('.page-item:last-child a.page-link')
      );
      expect(nextButton.nativeElement.getAttribute('aria-disabled')).toBe(
        'true'
      );
    });
  });
});
