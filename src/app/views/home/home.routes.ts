import { Routes } from '@angular/router';
import { CharactersComponent } from '../../components/characters/characters.component';
import { HomeComponent } from './home.component';
import { NotFoundComponent } from '../not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'characters',
        component: CharactersComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ]
  }
];