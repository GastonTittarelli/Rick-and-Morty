import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { RickAndMortyService } from '../../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';
import { Observable, lastValueFrom, catchError, of  } from 'rxjs';
import { StatusTranslatePipe } from '../../shared/pipes/status-translate.pipe';
import { GenderTranslatePipe } from '../../shared/pipes/gender-translate.pipe';

@Component({
  selector: 'app-characters-detail',
  imports: [CommonModule, RouterModule, StatusTranslatePipe, GenderTranslatePipe],
  templateUrl: './characters-detail.component.html',
  styleUrl: './characters-detail.component.css',
})
export class CharactersDetailComponent {
  episodes: any[] = [];
  character: any = null;
  isLoading: boolean = true;
  showAllEpisodes = false;
  
  constructor(
    private route: ActivatedRoute,
    private rickService: RickAndMortyService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.rickService.getCharacterById(id).pipe(
      catchError(err => {
        // Si hay error (404, etc), redirige al 404
        this.router.navigate(['/404']);
        return of(null);
      })
    ).subscribe(async (data) => {
      if (!data) {
        // Si la API no encontró el personaje
        this.router.navigate(['/404']);
        return;
      }

      this.character = data;
      const episodeUrls = data.episode;

      const episodeRequests: Observable<any>[] = episodeUrls.map((url: string) =>
        this.rickService.getEpisodeByUrl(url)
      );

      const responses = await Promise.all(
        episodeRequests.map((obs) => lastValueFrom(obs))
      );

      this.episodes = responses.sort((a: any, b: any) => a.id - b.id);
      this.isLoading = false;
    });
  }


  
}
