export interface VehicleData {
  id: string;
  date: string;
  vehicleCategory: '2W' | '3W' | '4W';
  vehicleClass: string;
  manufacturer: string;
  state: string;
  rto: string;
  registrations: number;
  quarter: string;
  year: number;
}

export interface GrowthData {
  category: string;
  manufacturer?: string;
  yoyGrowth: number;
  qoqGrowth: number;
  currentValue: number;
  previousValue: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  category?: string;
  manufacturer?: string;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  vehicleCategories: string[];
  manufacturers: string[];
  states: string[];
}