import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { Observable, forkJoin } from 'rxjs';
import { Character } from '../../shared/interfaces/characters.interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../service/favorites.service';
import { CommentsComponent } from '../comments/comments.component';
import { MessageService } from '../../service/messages.service';

@Component({
  selector: 'app-episode-detail',
  imports: [RouterLink, CommonModule, MatIconModule, CommentsComponent],
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
    public favoritesService: FavoritesService,
    private messageService: MessageService
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
        this.checkIfFavorite();  // Verifica si el episodio es favorito al cargar
      });
    }
  }

  toggleFavorite(): void {
  this.favoritesService.toggleFavorite(this.episode.id).subscribe({
    next: (res) => {
      this.checkIfFavorite();
      this.messageService.showMessageWithTimeout('success', res.message || 'Favorite list updated');
    },
    error: (err) => {
      this.messageService.handleError(err);
    }
  });
}

isFavorite: boolean = false;

checkIfFavorite() {
  this.favoritesService.getFavorites().subscribe((favs) => {
    this.isFavorite = favs.some(fav => fav.episodeId === this.episode.id);
  });
}
  
}
