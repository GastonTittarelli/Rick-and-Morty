import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../service/favorites.service';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { forkJoin } from 'rxjs';
import { Character } from '../../shared/interfaces/characters.interface';
import { MessageService } from '../../service/messages.service';

@Component({
  selector: 'app-favorite-list',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent implements OnInit {
  favorites: any[] = [];
  charactersMap: { [episodeId: number]: Character[] } = {};

  constructor(
    public favoritesService: FavoritesService,
    private router: Router,
    private rmService: RickAndMortyService,
  private messageService: MessageService 
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
  this.favoritesService.getFavorites().subscribe((favorites) => {
    const episodeIds = favorites.map(fav => fav.episodeId || fav.id); // Asegurate de tener el ID correcto

    const requests = episodeIds.map(id => this.rmService.getEpisodeById(id)); // esto debe devolver observable con el episodio

    forkJoin(requests).subscribe((episodes) => {
      this.favorites = episodes;

      // También traemos los personajes de cada episodio
      episodes.forEach((ep) => {
        const characterUrls = ep.characters?.slice(0, 6) || [];
        if (characterUrls.length) {
          const charRequests = characterUrls.map((url: string) =>
            this.rmService.getByUrl(url)
          );
          forkJoin<Character[]>(charRequests).subscribe((chars) => {
            this.charactersMap[ep.id] = chars;
          });
        } else {
          this.charactersMap[ep.id] = [];
        }
      });
    });
  });
}

  removeFavorite(episodeId: number) {
  this.favoritesService.removeFavorite(episodeId).subscribe({
    next: (res: any) => {
      this.favorites = this.favorites.filter(ep => ep.id !== episodeId);
      delete this.charactersMap[episodeId];

      const code = res.header?.resultCode ?? 0;
      const message = res.header?.message ?? 'Eliminado de favoritos';
      this.messageService.processResultCode(code, message);
    },
    error: (err: any) => {
      this.messageService.handleError(err);
    }
  });
}

  goToEpisode(id: number): void {
    this.router.navigate(['home/episodes', id]);
  }

  goToCharacter(url: string): void {
    const id = this.extractIdFromUrl(url);
    if (id) {
      this.router.navigate(['home/characters', id]);
    }
  }

  extractIdFromUrl(url: string): number | null {
    const match = url.match(/\/(\d+)$/);
    return match ? +match[1] : null;
  }
}
