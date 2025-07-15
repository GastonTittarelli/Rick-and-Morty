import { Injectable } from '@angular/core';
import { MessageService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favorites: any[] = [];

  constructor(private messageService: MessageService) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        this.favorites = JSON.parse(stored);
      } catch {
        this.favorites = [];
      }
    }
  }

  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  getFavorites(): any[] {
    return this.favorites;
  }

  addFavorite(episode: any): void {
    if (!this.isFavorite(episode.id)) {
      this.favorites.push(episode);
      this.saveFavorites();
      this.messageService.showMessageWithTimeout(
        'success',
        `Added episode to favorites`
      );
    }
  }

  removeFavorite(id: number): void {
    const removed = this.favorites.find(f => f.id === id);
    this.favorites = this.favorites.filter(fav => fav.id !== id);
    this.saveFavorites();
    if (removed) {
      this.messageService.showMessageWithTimeout(
        'info',
        `Removed episode from favorites`
      );
    }
  }

  isFavorite(id: number): boolean {
    return this.favorites.some((fav) => fav.id === id);
  }
}
