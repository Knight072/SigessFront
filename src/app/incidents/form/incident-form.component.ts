// src/app/incidents/form/incident-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IncidentsService } from '../../auth/services/incidents.service';
import { Incident } from '../../auth/models/incident.models';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident-form.component.html'
})
export class IncidentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(IncidentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = false;
  error = '';
  isEdit = false;
  id?: number;
  current?: Incident;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required]],
    type: ['', [Validators.required]],
    level: ['MEDIO', [Validators.required]],
    status: ['ABIERTO', [Validators.required]],
    incidentDate: ['', [Validators.required]],
    responsible: ['', [Validators.required]],
    area: ['', [Validators.required]],
    version: [0, [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = Number(idParam);
      this.load();
    } else {
      const today = new Date().toISOString().slice(0, 10);
      this.form.patchValue({ incidentDate: today });
    }
  }

  load(): void {
    if (!this.id) return;
    this.loading = true;
    this.api.get(this.id).subscribe({
      next: (it) => {
        this.loading = false;
        this.current = it;
        this.form.patchValue(it as any);
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message || 'Error cargando';
      }
    });
  }

  save(): void {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Completa los campos requeridos.';
      return;
    }

    this.loading = true;
    const payload = this.form.value as any;

    const obs = this.isEdit && this.id
      ? this.api.update(this.id, payload)
      : this.api.create(payload);

    obs.subscribe({
      next: (it) => {
        this.loading = false;
        this.router.navigate(['/incidents', it.id]);
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message || 'No se pudo guardar';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/incidents']);
  }
}
