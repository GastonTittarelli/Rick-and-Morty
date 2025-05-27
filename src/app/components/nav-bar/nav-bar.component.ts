import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  menuOpen = false;
  disableTransition = false;

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
}
