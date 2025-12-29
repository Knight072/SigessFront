// src/app/incidents/detail/incident-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { IncidentsService } from '../../auth/services/incidents.service';
import { Incident, IncidentHistoryItem, AttachmentMeta } from '../../auth/models/incident.models';
import { TokenStorageService } from '../../auth/services/token-storage.service';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incident-detail.component.html'
})
export class IncidentDetailComponent implements OnInit {
  loading = false;
  error = '';

  incident?: Incident;
  history: IncidentHistoryItem[] = [];
  attachments: AttachmentMeta[] = [];

  isSupervisor = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: IncidentsService,
    private store: TokenStorageService
  ) {}

  ngOnInit(): void {
    const u = this.store.getUser();
    this.isSupervisor = u?.role === 'SUPERVISOR';

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID inválido';
      return;
    }
    this.load(id);
  }

  load(id: number): void {
    this.error = '';
    this.loading = true;

    // Si algo revienta SINCRÓNICO (SSR/storage), no te deja loading pegado:
    try {
      this.api.get(id).subscribe({
        next: (it) => {
          this.incident = it;
          this.loading = false;

          this.api.history(id).subscribe({ next: (h) => (this.history = h), error: () => {} });
          this.api.attachments(id).subscribe({ next: (a) => (this.attachments = a), error: () => {} });
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.message || 'Error cargando detalle';
        }
      });
    } catch (e: any) {
      this.loading = false;
      this.error = e?.message || 'Error inicializando detalle (SSR/storage)';
    }
  }

  edit(): void {
    if (!this.incident) return;
    this.router.navigate(['/incidents', this.incident.id, 'edit']);
  }

  close(): void {
    if (!this.incident) return;
    this.api.close(this.incident.id, { version: this.incident.version }).subscribe({
      next: (it) => (this.incident = it),
      error: (e) => (this.error = e?.message || 'No se pudo cerrar')
    });
  }

  reopen(): void {
    if (!this.incident) return;
    this.api.reopen(this.incident.id, { version: this.incident.version }).subscribe({
      next: (it) => (this.incident = it),
      error: (e) => (this.error = e?.message || 'No se pudo reabrir')
    });
  }

  onFileSelected(ev: Event): void {
    if (!this.incident) return;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.api.uploadAttachment(this.incident.id, file).subscribe({
      next: (a) => (this.attachments = [a, ...this.attachments]),
      error: (e) => (this.error = e?.message || 'No se pudo subir el archivo')
    });
  }

  download(a: AttachmentMeta): void {
    if (!this.incident) return;
    this.api.downloadAttachment(this.incident.id, a.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = a.fileName || 'archivo';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: (e) => (this.error = e?.message || 'No se pudo descargar')
    });
  }
}
