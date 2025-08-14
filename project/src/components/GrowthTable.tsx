import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { GrowthData } from '../types/vehicle';
import { formatNumber, formatPercentage } from '../utils/calculations';

interface GrowthTableProps {
  data: GrowthData[];
  title: string;
  showManufacturer?: boolean;
  className?: string;
}

export const GrowthTable: React.FC<GrowthTableProps> = ({
  data,
  title,
  showManufacturer = false,
  className
}) => {
  const getGrowthIcon = (growth: number) => {
    if (growth === 0) return <Minus size={16} className="text-gray-400" />;
    return growth > 0 
      ? <TrendingUp size={16} className="text-emerald-600" />
      : <TrendingDown size={16} className="text-red-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth === 0) return 'text-gray-600';
    return growth > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className={clsx("bg-white rounded-xl shadow-sm border border-gray-200 p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Category</th>
              {showManufacturer && (
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Manufacturer</th>
              )}
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Current</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">YoY Growth</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">QoQ Growth</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <tr key={`${item.category}-${item.manufacturer || index}`} className="border-b border-gray-100">
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {item.category}
                </td>
                {showManufacturer && (
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {item.manufacturer || 'All'}
                  </td>
                )}
                <td className="py-3 px-2 text-sm text-gray-900 text-right">
                  {formatNumber(item.currentValue)}
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getGrowthIcon(item.yoyGrowth)}
                    <span className={clsx("text-sm font-medium", getGrowthColor(item.yoyGrowth))}>
                      {formatPercentage(item.yoyGrowth)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getGrowthIcon(item.qoqGrowth)}
                    <span className={clsx("text-sm font-medium", getGrowthColor(item.qoqGrowth))}>
                      {formatPercentage(item.qoqGrowth)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};