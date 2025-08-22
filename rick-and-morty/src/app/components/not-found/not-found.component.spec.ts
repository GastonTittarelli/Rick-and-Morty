import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { provideRouter, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NotFoundComponent 
      ],
      providers:  [
        provideRouter([
          { path: 'home/characters', component: NotFoundComponent } // Mockea el route
        ])
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente NotFound', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar la imagen correcta', () => {
    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement).toBeTruthy();
    
    const imgSrc = imgElement.nativeElement.getAttribute('src');
    expect(imgSrc).toBe('https://staticdelivery.nexusmods.com/mods/1151/images/528-0-1447526230.png');
    
    const imgAlt = imgElement.nativeElement.getAttribute('alt');
    expect(imgAlt).toBe('Rick and Motry absorbing by a portal');
  });

  it('debe mostrar el mensaje de error correcto', () => {
    const messageElement = fixture.debugElement.query(By.css('.notFoundMessage p'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain(
      'The page you are trying to search has been moved to another universe'
    );
  });

  it('debe tener un botón de inicio con el routerLink correcto', () => {
    const buttonElement = fixture.debugElement.query(By.css('.customBtn'));
    expect(buttonElement).toBeTruthy();
    
    expect(buttonElement.nativeElement.textContent).toContain('Get Me Home');
    
    const routerLink = buttonElement.nativeElement.getAttribute('ng-reflect-router-link');
    expect(routerLink).toBe('/home/characters');
  });

  it('debería tener las clases CSS correctas', () => {
    const notFoundContainer = fixture.debugElement.query(By.css('.notFoundContainer'));
    expect(notFoundContainer).toBeTruthy();
    
    const notFoundContent = fixture.debugElement.query(By.css('.notFoundContent'));
    expect(notFoundContent).toBeTruthy();
    
    const backgroundSpinner = fixture.debugElement.query(By.css('.background-spinner'));
    expect(backgroundSpinner).toBeTruthy();
    
    const notFoundMessage = fixture.debugElement.query(By.css('.notFoundMessage'));
    expect(notFoundMessage).toBeTruthy();
  });

  it('debe tener una estructura de sección adecuada', () => {
    const mainSection = fixture.debugElement.query(By.css('section.notf'));
    expect(mainSection).toBeTruthy();
    
    const innerSection = fixture.debugElement.query(By.css('.notf .notFoundContainer'));
    expect(innerSection).toBeTruthy();
  });

  it('debe navegar a /home/characters cuando se hace clic en el botón', () => {
  const router = TestBed.inject(Router);
  spyOn(router, 'navigateByUrl');
  
  const button = fixture.debugElement.query(By.css('.customBtn'));
  button.nativeElement.click();
  
  expect(router.navigateByUrl).toHaveBeenCalledWith(
    jasmine.stringMatching('/home/characters'),
    jasmine.any(Object)
  );
});
});