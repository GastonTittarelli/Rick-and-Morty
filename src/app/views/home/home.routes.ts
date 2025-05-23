import { Routes } from '@angular/router';
import { CharactersComponent } from '../../components/characters/characters.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'characters',
        component: CharactersComponent,
      },
      // {
      //   path: 'episodes',
      //   component: EpisodesComponent,
      // },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ]
  }
];