import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';

  onSubmit(event?: Event): void {
  event?.preventDefault();
  this.search.emit(this.searchTerm.trim());
}

clearSearch(event?: Event): void {
  event?.preventDefault();
  this.searchTerm = '';
  this.search.emit('');
}

  onInputChange(): void {
    if (this.searchTerm.trim() === '') {
      this.search.emit('');
    }
  }

}
