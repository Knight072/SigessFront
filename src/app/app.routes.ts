// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'incidents' },

  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'incidents',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./incidents/list/incidents-list.component').then(m => m.IncidentsListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./incidents/form/incident-form.component').then(m => m.IncidentFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./incidents/detail/incident-detail.component').then(m => m.IncidentDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./incidents/form/incident-form.component').then(m => m.IncidentFormComponent)
      }
    ]
  },

  {
    path: 'reports/top-areas',
    canActivate: [authGuard],
    loadComponent: () => import('./reports/top-areas/top-areas.component').then(m => m.TopAreasComponent)
  },
  {
    path: 'reports/critical-by-week',
    canActivate: [authGuard],
    loadComponent: () => import('./reports/critical-by-weeks/critical-by-week.component').then(m => m.CriticalByWeekComponent)
  },

  { path: '**', redirectTo: 'incidents' }
];
