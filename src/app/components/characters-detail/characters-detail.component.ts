import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RickAndMortyService } from '../../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';
import { Observable, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-characters-detail',
  imports: [CommonModule, RouterModule],
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
    private rickService: RickAndMortyService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rickService.getCharacterById(id).subscribe(async (data) => {
      this.character = data;
      const episodeUrls = data.episode;

      // Mapear las URLs a observables de episodios
      const episodeRequests: Observable<any>[] = episodeUrls.map((url: string) =>
        this.rickService.getEpisodeByUrl(url)
      );

      // Convertir todos los observables a promesas y esperar todas
      const responses = await Promise.all(
        episodeRequests.map((obs) => lastValueFrom(obs))
      );

      this.episodes = responses.sort((a: any, b: any) => a.id - b.id);
      this.isLoading = false; // datos listos
    });
  }
}
