export interface AreaMetricItem {
  area: string;
  total: number;
}

export interface TopAreasResponse {
  months: number;
  fromDate: string;
  toDate: string;
  items: AreaMetricItem[];
}

export interface WeekMetricItem {
  yearWeek: string;
  total: number;
}

export interface CriticalByWeekResponse {
  weeks: number;
  fromDate: string;
  toDate: string;
  items: WeekMetricItem[];
}
