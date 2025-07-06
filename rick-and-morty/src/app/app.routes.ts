import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { CharactersComponent } from './components/characters-list/characters-list.component';
import { CharactersDetailComponent } from './components/characters-detail/characters-detail.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/not-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
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

  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [PublicGuard], data: { animation: 'LoginPage' }  },
      { path: 'register', component: RegisterComponent, canActivate: [PublicGuard], data: { animation: 'RegisterPage' }  },
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