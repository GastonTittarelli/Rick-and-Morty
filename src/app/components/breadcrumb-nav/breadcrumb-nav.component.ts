import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './breadcrumb-nav.component.html',
  styleUrl: './breadcrumb-nav.component.css'
})
export class BreadcrumbNavComponent {
breadcrumbs: { label: string, url: string }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumb(this.route.root);
    });
  }

  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        breadcrumbs.push({
          label: routeURL.charAt(0).toUpperCase() + routeURL.slice(1), // Capitalize
          url: url
        });
      }
      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
