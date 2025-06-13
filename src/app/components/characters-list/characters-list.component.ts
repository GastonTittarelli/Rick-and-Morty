import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearcherComponent } from '../searcher/searcher.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { MessageService, AlertMessage } from '../../service/auth-messages.service';  // Importa el servicio
import { Observable } from 'rxjs';

@Component({
  selector: 'characters-app',
  imports: [CommonModule, SearcherComponent, PaginatorComponent],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.css', '../../layouts/auth-layout/auth-layout.component.css']
})
export class CharactersComponent implements OnInit {
  searchTerm: string = '';
  characters: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  noResults: boolean = false;

  alert$!: Observable<AlertMessage | null>; 

  constructor(
    private rickService: RickAndMortyService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.alert$ = this.messageService.alert$;
    this.loadCharacters();
  }

  handleSearch(term: string): void {
    if (typeof term !== 'string') return;

    this.searchTerm = term.trim();
    this.currentPage = 1;
    this.loadCharacters();
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadCharacters();
  }

  private loadCharacters(): void {
    this.fetchCharacters(this.currentPage, this.searchTerm);
  }

  private fetchCharacters(page: number, name: string = ''): void {
    this.rickService.getAllCharacters(page, name).subscribe({
      next: (data: any) => this.handleCharactersSuccess(data),
      error: (error) => this.handleCharactersError(error),
    });
  }

  private handleCharactersSuccess(data: any): void {
    this.characters = data.results;
    this.totalPages = data.info.pages;
    this.noResults = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  private handleCharactersError(error: any): void {
    if (error.status === 404) {
      this.characters = [];
      this.totalPages = 0;
      this.noResults = true;
    }
  }

  goToDetail(id: number): void {
    this.router.navigate(['/home/characters', id]);
  }
}
  
