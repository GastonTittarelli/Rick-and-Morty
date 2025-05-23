import { Component, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../../service/rick-and-morty.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'characters-app',
  imports: [CommonModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit {
  personajes: any[] = [];

  constructor(private rickService: RickAndMortyService) {}

  ngOnInit(): void {
    this.rickService.getAllCharacters().subscribe((data: any) => {
      this.personajes = data.results;
    });
  }
}
