import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { RickAndMortyService } from '../../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb-nav',
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumb-nav.component.html',
  styleUrl: './breadcrumb-nav.component.css',
})
export class BreadcrumbNavComponent implements OnInit {
  breadcrumbs: { label: string; url: string; clickable: boolean }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private rickService: RickAndMortyService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });
  }

  private async buildBreadcrumbs() {
    const root = this.route.root;
    const segments: string[] = this.router.url.split('/').filter((seg) => seg);
    const breadcrumbs: { label: string; url: string; clickable: boolean }[] = [];

    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segmentPath = segments[i];
      accumulatedPath += `/${segmentPath}`;

      let label = this.capitalize(segmentPath);
      let clickable = i !== segments.length - 1;

      // Si es un ID y el segmento anterior es 'characters'
      if (
        i > 0 &&
        /^\d+$/.test(segmentPath) &&
        segments[i - 1].toLowerCase() === 'characters'
      ) {
        try {
          const character = await this.rickService
            .getCharacterById(Number(segmentPath))
            .toPromise();
          label = character.name;
        } catch (error) {
          console.error('Error al obtener personaje', error);
        }
      }

      breadcrumbs.push({ label, url: accumulatedPath, clickable });
    }

    this.breadcrumbs = breadcrumbs;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
