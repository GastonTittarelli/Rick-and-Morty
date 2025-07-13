import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
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
        // Asegura que los cambios se actualicen
        this.buildBreadcrumbs();
      });

    // Se llamama una vez por si accede directamente
    this.buildBreadcrumbs();
  }

  private async buildBreadcrumbs() {
    const segments: string[] = this.router.url.split('/').filter((seg) => seg);
    const breadcrumbs: { label: string; url: string; clickable: boolean }[] =
      [];

    // Agrego manualmente el "Home"
    breadcrumbs.push({
      label: 'Home',
      url: '/home/characters',
      clickable: true,
    });

    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segmentPath = segments[i];
      accumulatedPath += `/${segmentPath}`;

      // Evita agregar dos veces "home" o "characters"
      if (segmentPath === 'home' || (i === 0 && segmentPath === 'characters')) {
        continue;
      }

      let label = this.capitalize(segmentPath);
      let clickable = i !== segments.length - 1;

      // Si es un ID y el segmento anterior es "characters" o "episodes"
      if (i > 0 && /^\d+$/.test(segmentPath)) {
      const previousSegment = segments[i - 1].toLowerCase();

      try {
        if (previousSegment === 'characters') {
          const character = await firstValueFrom(
            this.rickService.getCharacterById(Number(segmentPath))
          );
          label = character.name;
        } else if (previousSegment === 'episodes') {
          const episode = await firstValueFrom(
            this.rickService.getEpisodeById(Number(segmentPath))
          );
          label = `Episode ${episode.id} - ${episode.name}`;
        }
      } catch (error) {
        console.error('Error al obtener datos del breadcrumb', error);
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
