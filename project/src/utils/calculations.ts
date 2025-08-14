import { VehicleData, GrowthData } from '../types/vehicle';
import { format, subYears, subMonths } from 'date-fns';

export const calculateGrowthMetrics = (
  data: VehicleData[],
  groupBy: 'category' | 'manufacturer' = 'category'
): GrowthData[] => {
  const currentDate = new Date('2024-12-01');
  const previousYearDate = subYears(currentDate, 1);
  const previousQuarterDate = subMonths(currentDate, 3);

  const groupedData = data.reduce((acc, item) => {
    const key = groupBy === 'category' ? item.vehicleCategory : `${item.vehicleCategory}-${item.manufacturer}`;
    const itemDate = new Date(item.date);
    
    if (!acc[key]) {
      acc[key] = {
        current: 0,
        previousYear: 0,
        previousQuarter: 0
      };
    }

    // Current period (last 3 months)
    if (itemDate >= previousQuarterDate) {
      acc[key].current += item.registrations;
    }

    // Previous year same period
    const prevYearStart = subMonths(previousYearDate, 3);
    if (itemDate >= prevYearStart && itemDate < previousYearDate) {
      acc[key].previousYear += item.registrations;
    }

    // Previous quarter
    const prevQuarterStart = subMonths(previousQuarterDate, 3);
    if (itemDate >= prevQuarterStart && itemDate < previousQuarterDate) {
      acc[key].previousQuarter += item.registrations;
    }

    return acc;
  }, {} as Record<string, { current: number; previousYear: number; previousQuarter: number }>);

  return Object.entries(groupedData).map(([key, values]) => {
    const [category, manufacturer] = key.includes('-') ? key.split('-') : [key, undefined];
    
    const yoyGrowth = values.previousYear > 0 ? 
      ((values.current - values.previousYear) / values.previousYear) * 100 : 0;
    
    const qoqGrowth = values.previousQuarter > 0 ? 
      ((values.current - values.previousQuarter) / values.previousQuarter) * 100 : 0;

    return {
      category,
      manufacturer,
      yoyGrowth,
      qoqGrowth,
      currentValue: values.current,
      previousValue: values.previousYear
    };
  }).sort((a, b) => b.currentValue - a.currentValue);
};

export const formatNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatPercentage = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const aggregateDataByPeriod = (
  data: VehicleData[],
  period: 'month' | 'quarter' = 'month'
): Record<string, number> => {
  return data.reduce((acc, item) => {
    const date = new Date(item.date);
    const key = period === 'month' 
      ? format(date, 'yyyy-MM')
      : `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
    
    acc[key] = (acc[key] || 0) + item.registrations;
    return acc;
  }, {} as Record<string, number>);
};