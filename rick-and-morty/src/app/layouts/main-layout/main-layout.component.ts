import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { BreadcrumbNavComponent } from '../../components/breadcrumb-nav/breadcrumb-nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NgbModule, CommonModule, NavBarComponent, FooterComponent, BreadcrumbNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
