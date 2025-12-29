import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'incidents', renderMode: RenderMode.Prerender },
  { path: 'incidents/new', renderMode: RenderMode.Prerender },
  { path: 'reports/top-areas', renderMode: RenderMode.Prerender },
  { path: 'reports/critical-by-week', renderMode: RenderMode.Prerender },

  { path: 'incidents/:id', renderMode: RenderMode.Server },

  { path: '**', renderMode: RenderMode.Server },
];
