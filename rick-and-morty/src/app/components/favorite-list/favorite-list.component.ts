import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesService } from '../../service/favorites.service';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { forkJoin } from 'rxjs';
import { Character } from '../../shared/interfaces/characters.interface';

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
    private rmService: RickAndMortyService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = this.favoritesService.getFavorites();

    this.favorites.forEach(ep => {
      // Primeras 6 URLs de personajes. No mas, para no saturar
      const characterUrls = ep.characters?.slice(0, 6) || [];

      if (characterUrls.length) {
        // Para cada URL hacemos una petición y las unimos con forkJoin
        const requests = characterUrls.map((url: string) => this.rmService.getByUrl(url));

        forkJoin<Character[]>(requests).subscribe((chars: Character[]) => {
          this.charactersMap[ep.id] = chars;
        });
      } else {
        this.charactersMap[ep.id] = [];
      }
    });
  }

  removeFavorite(id: number): void {
    this.favoritesService.removeFavorite(id);
    this.loadFavorites();
  }

  goToEpisode(id: number): void {
    this.router.navigate(['home/episodes', id]);
  }
}
