// src/app/auth/models/incident.models.ts

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export type IncidentStatus = 'ABIERTO' | 'CERRADO' | string;
export type IncidentLevel = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO' | string;

export interface Incident {
  id: number;
  incidentDate: string;    // ISO string
  title: string;
  area: string;
  level: IncidentLevel;
  status: IncidentStatus;
  responsible: string;
  description?: string;
  version: number;
}

export interface IncidentHistoryItem {
  id?: number;
  at: string;              // ISO string
  actor: string;
  action: string;          // ej: CREATED/UPDATED/CLOSED/REOPENED
  field?: string;          // OJO: si tu back no usa "fieldName", usa "field"
  oldValue?: string | null;
  newValue?: string | null;
}

export interface AttachmentMeta {
  id: number;
  fileName: string;        // OJO: en tus errores te sugiere fileName (no filename)
  size?: number;           // si tu back no tiene sizeBytes, usa size
  contentType?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}
