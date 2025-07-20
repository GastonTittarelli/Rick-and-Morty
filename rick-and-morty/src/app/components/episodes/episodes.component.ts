import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService } from '../../service/favorites.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-episodes',
  imports: [PaginatorComponent, CommonModule, MatIconModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css'
})

export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  displayedEpisodes: any[] = [];
  currentPage = 1;
  episodesPerPage = 10;
  totalEpisodes = 0;
  favoriteEpisodeIds: Set<number> = new Set();

  constructor(
    private apiService: RickAndMortyService,
    private router: Router,
    private favoritesService: FavoritesService
) {}

  ngOnInit(): void {
    this.loadEpisodes();
    this.loadFavorites();
  }

  loadEpisodes(): void {
    const apiPage = Math.ceil((this.currentPage * this.episodesPerPage) / 20);
    this.apiService.getEpisodes(apiPage).subscribe((response) => {
      this.totalEpisodes = response.info.count;
      this.episodes = response.results;

      // Calculate the start index based on the current page and episodes per page
      const start = (this.currentPage - 1) % 2 * this.episodesPerPage;
      this.displayedEpisodes = this.episodes.slice(start, start + this.episodesPerPage);
    });
  }


  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe(favs => {
      this.favoriteEpisodeIds = new Set(favs.map(fav => fav.episodeId));
    });
  }


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadEpisodes();
  }

  get totalPages(): number {
    return Math.ceil(this.totalEpisodes / this.episodesPerPage);
  }

  goToEpisode(id: number) {
  this.router.navigate(['home/episodes', id]);
}

toggleFavorite(episode: any): void {
    this.favoritesService.toggleFavorite(episode.id).subscribe(() => {
      this.loadFavorites();
    });
  }

  isFavorite(id: number): boolean {
    return this.favoriteEpisodeIds.has(id);
  }

}
