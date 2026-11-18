import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'expenses',
    canActivate: [authGuard],
    loadComponent: () => import('./features/expenses/expenses.component').then(m => m.ExpensesComponent)
  },
  {
    path: 'investments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/investments/investments.component').then(m => m.InvestmentsComponent)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'spaces',
    canActivate: [authGuard],
    loadComponent: () => import('./features/spaces/spaces.component').then(m => m.SpacesComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
