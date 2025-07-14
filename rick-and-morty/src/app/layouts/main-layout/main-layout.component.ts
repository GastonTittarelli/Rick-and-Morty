import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BreadcrumbNavComponent } from '../../components/breadcrumb-nav/breadcrumb-nav.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../service/users.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NgbModule, CommonModule, NavBarComponent, FooterComponent, BreadcrumbNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: () => {
        // Token válido → todo perfecto
      },
      error: () => {
        // Token inválido 
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}