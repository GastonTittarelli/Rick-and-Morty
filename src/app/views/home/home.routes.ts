import { Routes } from '@angular/router';
import { CharactersComponent } from '../../components/characters-list/characters-list.component';
import { HomeComponent } from './home.component';
import { CharactersDetailComponent } from '../../components/characters-detail/characters-detail.component';

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
        path: 'characters/:id',
        component: CharactersDetailComponent,
        data: { renderMode: 'client' },
      },
      // esta ya no es necesaria:
      // {
      //   path: '**',
      //   redirectTo: '',
      //   pathMatch: 'full',
      // },
    ]
  }

];