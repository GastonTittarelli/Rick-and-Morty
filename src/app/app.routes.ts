import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CharactersComponent } from './components/characters-list/characters-list.component';
import { CharactersDetailComponent } from './components/characters-detail/characters-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home/characters',
        pathMatch: 'full',
      },
      {
        path: 'home/characters',
        component: CharactersComponent,
      },
      {
        path: 'home/characters/:id',
        component: CharactersDetailComponent,
      },
    ]
  },

  // Ruta para página 404 sin layout
  {
    path: '404',
    component: NotFoundComponent,
  },

  {
    path: '**',
    redirectTo: '404',
  }
];