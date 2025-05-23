import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BreadcrumbNavComponent } from './components/breadcrumb-nav/breadcrumb-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgbModule, CommonModule, NavBarComponent, FooterComponent, BreadcrumbNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'mi-proyecto-angular';
}
