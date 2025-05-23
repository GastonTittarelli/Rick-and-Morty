import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'characters-app',
  imports: [CommonModule, FormsModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit {
  searchTerm: string = '';

  personajes: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  
  constructor(private rickService: RickAndMortyService) {}

  ngOnInit(): void {
    this.fetchCharacters(this.currentPage);
  }

  fetchCharacters(page: number): void {
  this.rickService.getAllCharacters(page, this.searchTerm).subscribe((data: any) => {
    this.personajes = data.results;
    this.totalPages = data.info.pages;
    this.currentPage = page;
  });
}

  changePage(page: number | string): void {
  if (page === '...' || typeof page !== 'number' || page < 1 || page > this.totalPages) {
    return;
  }
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

}
