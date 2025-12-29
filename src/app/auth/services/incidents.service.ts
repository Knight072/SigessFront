import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { Incident, PageResult, IncidentHistoryItem, AttachmentMeta } from '../models/incident.models';

export interface ListIncidentsQuery {
  q?: string;
  status?: string;
  level?: string;
  responsible?: string;
  area?: string;
  fromDate?: string;
  toDate?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface VersionRequest {
  version: number;
}

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/incidents`;

  list(q: ListIncidentsQuery): Observable<PageResult<Incident>> {
    let params = new HttpParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<PageResult<Incident>>(this.base, { params });
  }

  get(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.base}/${id}`);
  }

  create(payload: Partial<Incident>): Observable<Incident> {
    return this.http.post<Incident>(this.base, payload);
  }

  update(id: number, payload: Partial<Incident>): Observable<Incident> {
    return this.http.put<Incident>(`${this.base}/${id}`, payload);
  }

  history(id: number): Observable<IncidentHistoryItem[]> {
    return this.http.get<IncidentHistoryItem[]>(`${this.base}/${id}/history`);
  }

  attachments(id: number): Observable<AttachmentMeta[]> {
    return this.http.get<AttachmentMeta[]>(`${this.base}/${id}`);
  }

  close(id: number, body: VersionRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.base}/${id}/close`, body);
  }

  reopen(id: number, body: VersionRequest): Observable<Incident> {
    return this.http.post<Incident>(`${this.base}/${id}/reopen`, body);
  }

  uploadAttachment(id: number, file: File): Observable<AttachmentMeta> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<AttachmentMeta>(`${this.base}/${id}/attachments`, form);
  }

  downloadAttachment(incidentId: number, attachmentId: number): Observable<Blob> {
    return this.http.get(`${this.base}/${incidentId}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
  }
}
