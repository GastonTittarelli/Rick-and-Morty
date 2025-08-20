import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../service/users.service';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  menuOpen = false;
  disableTransition = false;
  userName: string | null = null;

  constructor(
    private eRef: ElementRef, 
    private router: Router,
    private authService: AuthService
) {
  this.setUserName();

  this.router.events.subscribe(() => {
    this.setUserName();
  });
}

private setUserName() {
  const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userData && userData !== 'undefined') {
    try {
      const user = JSON.parse(userData);
      this.userName = user?.name || null;
    } catch (error) {
      console.error('Error al parsear user del localStorage', error);
      this.userName = null;
    }
  } else {
    this.userName = null;
  }
}
  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.disableTransition = false;
  }

  closeMenu() {
    this.disableTransition = true;
    this.menuOpen = false;

    setTimeout(() => {
      this.disableTransition = false;
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.menuOpen && !this.eRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }
}
