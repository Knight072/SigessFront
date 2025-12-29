import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IncidentsService } from '../../auth/services/incidents.service';
import { Incident, PageResult } from '../../auth/models/incident.models';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './incidents-list.component.html'
})
export class IncidentsListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(IncidentsService);
  private router = inject(Router);

  loading = false;
  error = '';

  page = 0;
  size = 10;
  total = 0;

  data: Incident[] = [];

  form = this.fb.nonNullable.group({
    q: [''],
    status: [''],
    level: [''],
    responsible: [''],
    area: [''],
    fromDate: [''],
    toDate: [''],
    sort: ['incidentDate,desc']
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error = '';
    this.loading = true;

    const f = this.form.getRawValue();

    this.api.list({
      q: f.q || undefined,
      status: f.status || undefined,
      level: f.level || undefined,
      responsible: f.responsible || undefined,
      area: f.area || undefined,
      fromDate: f.fromDate || undefined,
      toDate: f.toDate || undefined,
      sort: f.sort || 'incidentDate,desc',
      page: this.page,
      size: this.size
    }).subscribe({
      next: (res: PageResult<Incident>) => {
        this.loading = false;
        this.data = res.items;
        this.total = res.total;
        this.page = res.page;
        this.size = res.size;
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message;
      }
    });
  }

  onPageChange(p: number): void {
    this.page = p;
    this.load();
  }

  goDetail(id: number): void {
    this.router.navigate(['/incidents', id]);
  }

  createNew(): void {
    this.router.navigate(['/incidents/new']);
  }
}
