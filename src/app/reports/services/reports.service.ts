import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { CriticalByWeekResponse, TopAreasResponse } from '../models/report.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  topAreas(months = 3): Observable<TopAreasResponse> {
    const params = new HttpParams().set('months', String(months));
    return this.http.get<TopAreasResponse>(`${this.base}/reports/top-areas`, { params });
  }

  criticalByWeek(weeks = 8): Observable<CriticalByWeekResponse> {
    const params = new HttpParams().set('weeks', String(weeks));
    return this.http.get<CriticalByWeekResponse>(`${this.base}/reports/critical-by-week`, { params });
  }
}
