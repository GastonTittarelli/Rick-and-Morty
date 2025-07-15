import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { Observable, forkJoin } from 'rxjs';
import { Character } from '../../shared/interfaces/characters.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../service/favorites.service';

@Component({
  selector: 'app-episode-detail',
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.css'
})

export class EpisodeDetailComponent implements OnInit {
  episode: any = null;
  characters: Character[] = [];
  showAllCharacters: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: RickAndMortyService,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getEpisodeById(+id).subscribe((ep) => {
        this.episode = ep;

        const characterRequests: Observable<Character>[] = ep.characters.map((url: string) =>
          this.api.getByUrl(url)
        );

        forkJoin(characterRequests).subscribe((res: Character[]) => {
          this.characters = res;
        });
      });
    }
  }

  toggleFavorite(): void {
    if (!this.episode) return;
    if (this.favoritesService.isFavorite(this.episode.id)) {
      this.favoritesService.removeFavorite(this.episode.id);
    } else {
      this.favoritesService.addFavorite(this.episode);
    }
  }

  isFavorite(): boolean {
    return this.episode && this.favoritesService.isFavorite(this.episode.id);
  }
  
}
