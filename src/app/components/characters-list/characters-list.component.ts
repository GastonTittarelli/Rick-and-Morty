import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'characters-app',
  imports: [CommonModule, FormsModule],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.css',
})
export class CharactersComponent implements OnInit {
  searchTerm: string = '';

  personajes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  noResults: boolean = false;
  
  constructor(private rickService: RickAndMortyService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCharacters(this.currentPage);
  }

  fetchCharacters(page: number): void {
  this.rickService.getAllCharacters(page, this.searchTerm).subscribe({next: (data: any) => {
    this.personajes = data.results;
    this.totalPages = data.info.pages;
    this.noResults = false;
    this.scrollToTop();
      },
      error: (error) => {
        if (error.status === 404) {
          this.personajes = [];
          this.totalPages = 0;
          this.noResults = true; // ⬅️ activar bandera si no se encuentra nada
        }
      }
    });
  }

  changePage(page: number | string): void {
  if (page === '...' || typeof page !== 'number' || page < 1 || page > this.totalPages) {
    return;
  }
  this.currentPage = page;
  this.fetchCharacters(page);
}
  getPageNumbers(): (number | string)[] {
  const total = this.totalPages;
  const current = this.currentPage;
  const delta = 2; // cantidad de botones a la izquierda y derecha
  const range: (number | string)[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // siempre mostrar la primera

  if (left > 2) {
    range.push('...');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) {
    range.push('...');
  }

  if (total > 1) {
    range.push(total); // siempre mostrar la última
  }

  return range;
}

onSearch(): void {
  this.currentPage = 1;
  this.fetchCharacters(this.currentPage);
}

onInputChange(): void {
  if (this.searchTerm.trim() === '') {
    this.currentPage = 1;
    this.fetchCharacters(this.currentPage);
  }
}

goToDetail(id: number): void {
  this.router.navigate(['/home/characters', id]);
}

scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}
}
