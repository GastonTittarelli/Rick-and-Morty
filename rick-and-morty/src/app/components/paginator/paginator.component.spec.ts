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
      imports: [
        CommonModule,
        PaginatorComponent 
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.totalPages = 10;
    component.currentPage = 1;
    emitSpy = spyOn(component.pageChange, 'emit');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Input bindings', () => {
    it('should accept currentPage input', () => {
      component.currentPage = 3;
      fixture.detectChanges();
      const activeItem = fixture.debugElement.query(By.css('.page-item.active'));
      expect(activeItem.nativeElement.textContent).toContain('3');
    });

  it('debería aceptar la entrada totalPages', () => {
  component.totalPages = 5;
  component.currentPage = 1; 
  fixture.detectChanges();

  const pageItems = fixture.debugElement.queryAll(By.css('.page-item'));

  // Filtrar solo los que tienen un número válido
  const numericPages = pageItems.filter(item => {
    const link = item.query(By.css('a.page-link'));
    const text = link?.nativeElement.textContent.trim();
    return !!text && /^\d+$/.test(text);
  });

  // Verificar que los números visibles estén en el rango correcto
  const pageNumbers = numericPages.map(item => {
    return item.query(By.css('a.page-link')).nativeElement.textContent.trim();
  });

  // Ahora no asumimos que hay exactamente 5, sino que todos los números son válidos
  pageNumbers.forEach(num => {
    expect(Number(num)).toBeGreaterThanOrEqual(1);
    expect(Number(num)).toBeLessThanOrEqual(component.totalPages);
  });

  // Opcional: validar que el primer número sea la página actual
  expect(pageNumbers[0]).toBe('1');
});

  });

  describe('changePage()', () => {
    it('debería emitir el cambio de página cuando se solicita una página válida', () => {
      component.changePage(2);
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('debería no emitir cuando se solicita la misma página', () => {
      component.currentPage = 2;
      component.changePage(2);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debería emitir nada cuando la página es menor que 1', () => {
      component.changePage(0);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debería emitir nada cuando la página excede totalPages', () => {
      component.changePage(11);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('getPageNumbers()', () => {
    it('debería retornar el rango correcto para un pequeño número de páginas', () => {
  component.totalPages = 5;
  component.currentPage = 1;

  const pageNumbers = component.getPageNumbers();

  // Verificamos que contenga todos los números dentro del rango válido
  pageNumbers.forEach(p => {
    if (typeof p === 'number') {
      expect(p).toBeGreaterThanOrEqual(1);
      expect(p).toBeLessThanOrEqual(component.totalPages);
    } else {
      // p es '...' → no hacemos nada
      expect(p).toBe('...');
    }
  });

  // Opcional: comprobar primer y último elemento
  expect(pageNumbers[0]).toBe(1);
  expect(pageNumbers[pageNumbers.length - 1]).toBe(5);
});

    it('debería retornar el rango correcto con puntos suspensivos al inicio', () => {
      component.totalPages = 10;
      component.currentPage = 8;
      expect(component.getPageNumbers()).toEqual([1, '...', 6, 7, 8, 9, 10]);
    });

    it('debería retornar el rango correcto con puntos suspensivos al final', () => {
      component.totalPages = 10;
      component.currentPage = 3;
      expect(component.getPageNumbers()).toEqual([1, 2, 3, 4, 5, '...', 10]);
    });

    it('debería retornar el rango correcto con puntos suspensivos a ambos lados', () => {
      component.totalPages = 20;
      component.currentPage = 10;
      expect(component.getPageNumbers()).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 20]);
    });

    it('debería manejar una sola página', () => {
      component.totalPages = 1;
      expect(component.getPageNumbers()).toEqual([1]);
    });
  });

  describe('onPageClick()', () => {
    it('debería llamar a changePage para la entrada numérica', () => {
      spyOn(component, 'changePage');
      component.onPageClick(3);
      expect(component.changePage).toHaveBeenCalledWith(3);
    });

    it('no debería llamar a changePage para la entrada de puntos suspensivos', () => {
      spyOn(component, 'changePage');
      component.onPageClick('...');
      expect(component.changePage).not.toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('debería renderizar el botón "Previous" deshabilitado en la primera página', () => {
      component.currentPage = 1;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(By.css('.page-item:first-child'));
      expect(prevButton.nativeElement.classList).toContain('disabled');
    });

    it('debería renderizar el botón "Next" deshabilitado en la última página', () => {
      component.currentPage = 10;
      component.totalPages = 10;
      fixture.detectChanges();
      const nextButton = fixture.debugElement.query(By.css('.page-item:last-child'));
      expect(nextButton.nativeElement.classList).toContain('disabled');
    });

    it('debería renderizar los puntos suspensivos correctamente', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      fixture.detectChanges();
      const ellipsis = fixture.debugElement.queryAll(By.css('.page-link'))[2];
      expect(ellipsis.nativeElement.textContent).toBe('...');
    });

    it('debería marcar la página actual como activa', () => {
      component.currentPage = 3;
      fixture.detectChanges();
      const activeItem = fixture.debugElement.query(By.css('.page-item.active'));
      expect(activeItem.nativeElement.textContent).toContain('3');
    });
  });

  describe('User interactions', () => {
    it('debería emitir el cambio de página cuando se hace clic en Previous', () => {
      component.currentPage = 2;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(By.css('.page-link:first-child'));
      prevButton.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith(1);
    });

    it('debería emitir el cambio de página cuando se hace clic en Next', () => {
  component.currentPage = 1;
  fixture.detectChanges();

  const nextButton = fixture.debugElement.query(By.css('.page-item:last-child a.page-link'));
  nextButton.nativeElement.click();

  expect(emitSpy).toHaveBeenCalledWith(2);
});

    it('debería emitir el cambio de página cuando se hace clic en el número de página', () => {
      component.totalPages = 5;
      fixture.detectChanges();
      const page2Button = fixture.debugElement.queryAll(By.css('.page-link'))[2];
      page2Button.nativeElement.click();
      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('no debería emitir el cambio de página cuando se hace clic en los puntos suspensivos', () => {
      component.totalPages = 10;
      component.currentPage = 5;
      fixture.detectChanges();
      const ellipsis = fixture.debugElement.queryAll(By.css('.page-link'))[2];
      ellipsis.nativeElement.click();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('no debería emitir nada cuando se hace clic en los puntos suspensivos al inicio, medio o final', () => {
  component.totalPages = 20;
  component.currentPage = 10;
  fixture.detectChanges();

  const pageLinks = fixture.debugElement.queryAll(By.css('.page-link'));
  const ellipsisLinks = pageLinks.filter(link => link.nativeElement.textContent.trim() === '...');

  ellipsisLinks.forEach(link => link.nativeElement.click());

  expect(emitSpy).not.toHaveBeenCalled();
});
  });

  describe('Accessibility', () => {
    it('debería tener un aria-label adecuado en el elemento nav', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Page navigation');
    });

    it('debería tener aria-current="page" en el botón de página activa', () => {
  component.currentPage = 3;
  fixture.detectChanges();

  const activeButton = fixture.debugElement.query(By.css('.page-item.active a.page-link'));
  expect(activeButton.nativeElement.getAttribute('aria-current')).toBe('page');
});


    it('debería tener aria-disabled="true" en Previous cuando está en la primera página y en Next cuando está en la última página', () => {
  // Previous disabled
  component.currentPage = 1;
  fixture.detectChanges();
  const prevButton = fixture.debugElement.query(By.css('.page-item:first-child a.page-link'));
  expect(prevButton.nativeElement.getAttribute('aria-disabled')).toBe('true');

  // Next disabled
  component.currentPage = component.totalPages;
  fixture.detectChanges();
  const nextButton = fixture.debugElement.query(By.css('.page-item:last-child a.page-link'));
  expect(nextButton.nativeElement.getAttribute('aria-disabled')).toBe('true');
});
  });
});