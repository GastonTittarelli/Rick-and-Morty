// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CharactersComponent } from './characters-list.component';
// import { RickAndMortyService } from '../../service/rick-and-morty.service';
// import { of, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { SearcherComponent } from '../searcher/searcher.component';
// import { PaginatorComponent } from '../paginator/paginator.component';
// import { By } from '@angular/platform-browser';

// // Mock del servicio
// class RickAndMortyServiceMock {
//   getAllCharacters(page: number, name: string = '') {
//     const data = {
//       results: [{ id: 1, name: 'Rick Sanchez', image: 'https://archives.bulbagarden.net/media/upload/b/b6/Squirtle_Squad.png' }],
//       info: { pages: 2 }
//     };
//     return of(data);
//   }
// }

// describe('CharactersComponent', () => {
//   let component: CharactersComponent;
//   let fixture: ComponentFixture<CharactersComponent>;
//   let rickService: RickAndMortyService;
//   let router: Router;

//   const routerMock = { navigate: jasmine.createSpy('navigate') };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [CommonModule, SearcherComponent, PaginatorComponent, CharactersComponent],
//       providers: [
//         { provide: RickAndMortyService, useClass: RickAndMortyServiceMock },
//         { provide: Router, useValue: routerMock }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(CharactersComponent);
//     component = fixture.componentInstance;
//     rickService = TestBed.inject(RickAndMortyService);
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   it('debe crearse el componente CharactersList', () => {
//     expect(component).toBeTruthy();
//   });

//   it('debe cargar personajes al inicializarse', () => {
//     spyOn(rickService, 'getAllCharacters').and.callThrough();
//     component.ngOnInit();
//     expect(rickService.getAllCharacters).toHaveBeenCalledWith(1, '');
//   });

//   it('debe actualizar searchTerm y recargar personajes al buscar', () => {
//     spyOn(component as any, 'loadCharacters'); 
//     component.handleSearch('Rick');

//     expect(component.searchTerm).toBe('Rick');
//     expect(component.currentPage).toBe(1);
//     expect((component as any).loadCharacters).toHaveBeenCalled(); // accedemos como any porque es private el metodo
//   });

//   it('no debe ejecutar loadCharacters si el término no es string', () => {
//     spyOn(component as any, 'loadCharacters');
//     component.handleSearch(null as any);
//     expect((component as any).loadCharacters).not.toHaveBeenCalled();
//   });

//   it('debe actualizar la página actual y recargar personajes', () => {
//     spyOn(component as any, 'loadCharacters');
//     component.handlePageChange(3);
//     expect(component.currentPage).toBe(3);
//     expect((component as any).loadCharacters).toHaveBeenCalled();
//   });

//   it('deber manejar correctamente la respuesta exitosa de personajes', () => {
//     spyOn(window, 'scrollTo');
//     const data = { results: [{ id: 1, name: 'Rick', image: 'https://archives.bulbagarden.net/media/upload/b/b6/Squirtle_Squad.png' }], info: { pages: 2 } };
//     (component as any).handleCharactersSuccess(data);
//     expect(component.characters.length).toBe(1);
//     expect(component.totalPages).toBe(2);
//     expect(component.noResults).toBeFalse();
//     expect(window.scrollTo).toHaveBeenCalled();
//   });

//   it('deber manejar error 404 correctamente', () => {
//     const error = { status: 404 };
//     (component as any).handleCharactersError(error);
//     expect(component.characters.length).toBe(0);
//     expect(component.totalPages).toBe(0);
//     expect(component.noResults).toBeTrue();
//   });

//   it('debe navegar a la página de detalle del personaje', () => {
//     component.goToDetail(1);
//     expect(router.navigate).toHaveBeenCalledWith(['/home/characters', 1]);
//   });

//   it('debe renderizar las tarjetas de personajes', () => {
//     component.characters = [{ id: 1, name: 'Rick', image: 'https://archives.bulbagarden.net/media/upload/b/b6/Squirtle_Squad.png' }];
//     fixture.detectChanges();
//     const cards = fixture.nativeElement.querySelectorAll('.card');
//     expect(cards.length).toBe(1);
//   });

//   it('debe mostrar mensaje de noResults', () => {
//     component.noResults = true;
//     component.searchTerm = 'Unknown';
//     fixture.detectChanges();
//     const msg = fixture.nativeElement.querySelector('p.mt-3');
//     expect(msg.textContent).toContain('Oops.. There is no character named "Unknown"');
//   });

//   it('debe llamar handleSearch cuando app-search emita un término', () => {
//     spyOn(component, 'handleSearch');
//     const searchComp = fixture.debugElement.nativeElement.querySelector('app-search');
//     searchComp.dispatchEvent(new CustomEvent('search', { detail: 'Rick' }));
//     expect(component.handleSearch).toHaveBeenCalled();
//   });

//   it('debe llamar handlePageChange cuando app-paginator emita un cambio de página', () => {
//   spyOn(component, 'handlePageChange');

//   // Obtengo el hijo usando DebugElement
//   const paginatorDebug = fixture.debugElement.query(By.css('app-paginator'));

//   // Mando el evento Angular @Output correctamente
//   paginatorDebug.triggerEventHandler('pageChange', 2);

//   expect(component.handlePageChange).toHaveBeenCalledWith(2);
// });
// });
