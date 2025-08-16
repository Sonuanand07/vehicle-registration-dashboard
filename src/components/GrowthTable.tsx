import React from 'react';
import { TrendingUp, TrendingDown, Minus, Car, Bike, Truck } from 'lucide-react';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '2W': return <Bike size={16} className="text-blue-600" />;
      case '3W': return <Truck size={16} className="text-green-600" />;
      case '4W': return <Car size={16} className="text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className={clsx("bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300", className)}>
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
        {title}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 bg-gray-50 rounded-tl-lg">Category</th>
              {showManufacturer && (
                <th className="text-left py-4 px-3 text-sm font-bold text-gray-700 bg-gray-50">Manufacturer</th>
              )}
              <th className="text-right py-4 px-3 text-sm font-bold text-gray-700 bg-gray-50">Current</th>
              <th className="text-right py-4 px-3 text-sm font-bold text-gray-700 bg-gray-50">YoY Growth</th>
              <th className="text-right py-4 px-3 text-sm font-bold text-gray-700 bg-gray-50 rounded-tr-lg">QoQ Growth</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <tr key={`${item.category}-${item.manufacturer || index}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-sm font-semibold text-gray-900">{item.category}</span>
                  </div>
                </td>
                {showManufacturer && (
                  <td className="py-4 px-3 text-sm font-medium text-gray-700">
                    {item.manufacturer || 'All'}
                  </td>
                )}
                <td className="py-4 px-3 text-sm font-bold text-gray-900 text-right">
                  {formatNumber(item.currentValue)}
                </td>
                <td className="py-4 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {getGrowthIcon(item.yoyGrowth)}
                    <span className={clsx("text-sm font-medium", getGrowthColor(item.yoyGrowth))}>
                      {formatPercentage(item.yoyGrowth)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-3 text-right">
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