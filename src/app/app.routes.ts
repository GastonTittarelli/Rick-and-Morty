import { Routes } from '@angular/router';
import { CharactersComponent } from './components/characters/characters.component';
import { HomeComponent } from './views/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters', component: CharactersComponent },
  { path: '**', redirectTo: '' }
];
