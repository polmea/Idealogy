import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'ideas/:id',
    loadComponent: () =>
      import('./pages/idea-detail/idea-detail').then((m) => m.IdeaDetail),
  },
  {
    path: 'sell',
    loadComponent: () =>
      import('./pages/sell-idea/sell-idea').then((m) => m.SellIdea),
    canActivate: [authGuard],
  },
  {
    path: 'requests',
    loadComponent: () =>
      import('./pages/requests/requests').then((m) => m.Requests),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },
  { path: '**', redirectTo: '' },
];

