import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-episodes',
  imports: [PaginatorComponent, CommonModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css'
})

export class EpisodesComponent implements OnInit {
  episodes: any[] = [];
  displayedEpisodes: any[] = [];
  currentPage = 1;
  episodesPerPage = 10;
  totalEpisodes = 0;

  constructor(
    private apiService: RickAndMortyService,
    private router: Router
) {}

  ngOnInit(): void {
    this.loadEpisodes();
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
}
