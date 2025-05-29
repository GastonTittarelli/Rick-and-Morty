import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
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
  showAllEpisodes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private rickService: RickAndMortyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.getCharacterIdFromRoute();
    if (!id) {
      this.redirectTo404();
      return;
    }

    this.loadCharacter(id);
  }

  private getCharacterIdFromRoute(): number | null {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return isNaN(id) ? null : id;
  }

  private loadCharacter(id: number): void {
    this.rickService.getCharacterById(id).pipe(
      catchError(() => {
        this.redirectTo404();
        return of(null);
      })
    ).subscribe((character) => {
      if (!character) {
        this.redirectTo404();
        return;
      }

      this.character = character;
      this.loadEpisodes(character.episode);
    });
  }

  private async loadEpisodes(episodeUrls: string[]): Promise<void> {
    try {
      const episodeRequests: Observable<any>[] = episodeUrls.map(url =>
        this.rickService.getEpisodeByUrl(url)
      );

      const episodes = await Promise.all(
        episodeRequests.map(obs => lastValueFrom(obs))
      );

      this.episodes = episodes.sort((a, b) => a.id - b.id);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private redirectTo404(): void {
    this.router.navigate(['/404']);
  }

  get statusClass(): string {
    const statusMap: Record<string, string> = {
      'Alive': 'alive',
      'Dead': 'dead',
      'unknown': 'unknown'
    };
    return statusMap[this.character?.status] || '';
  }

  get visibleEpisodes(): any[] {
    return this.showAllEpisodes ? this.episodes : this.episodes.slice(0, 21);
  }

  get shouldShowMore(): boolean {
    return this.episodes.length > 21 && !this.showAllEpisodes;
  }

}
