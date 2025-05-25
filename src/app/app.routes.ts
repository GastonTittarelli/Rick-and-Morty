import { Routes } from '@angular/router';
import { NotFoundComponent } from './views/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./views/home/home.routes').then(m => m.routes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
