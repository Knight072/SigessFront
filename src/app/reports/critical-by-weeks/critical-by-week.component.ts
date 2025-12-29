import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../services/reports.service';
import { CriticalByWeekResponse } from '../models/report.models';

@Component({
  selector: 'app-critical-by-week',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './critical-by-week.component.html'
})
export class CriticalByWeekComponent implements OnInit {
  loading = false;
  error = '';
  res?: CriticalByWeekResponse;

  constructor(private api: ReportsService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.criticalByWeek().subscribe({
      next: (r) => { this.loading = false; this.res = r; },
      error: (e: Error) => { this.loading = false; this.error = e.message; }
    });
  }
}
