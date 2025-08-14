import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { formatNumber, formatPercentage } from '../utils/calculations';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'YoY' | 'QoQ';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  className
}) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className={clsx(
      "bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatNumber(value)}
          </p>
          <div className="flex items-center gap-1">
            <Icon 
              size={16} 
              className={clsx(
                isNeutral ? 'text-gray-400' : 
                isPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            />
            <span className={clsx(
              "text-sm font-medium",
              isNeutral ? 'text-gray-600' : 
              isPositive ? 'text-emerald-600' : 'text-red-600'
            )}>
              {formatPercentage(change)} {changeType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};