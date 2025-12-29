import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../services/reports.service';
import { TopAreasResponse } from '../models/report.models';

@Component({
  selector: 'app-top-areas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-areas.component.html'
})
export class TopAreasComponent implements OnInit {
  loading = false;
  error = '';
  res?: TopAreasResponse;

  constructor(private api: ReportsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.topAreas().subscribe({
      next: (r) => { this.loading = false; this.res = r; },
      error: (e: Error) => { this.loading = false; this.error = e.message; }
    });
  }
}
