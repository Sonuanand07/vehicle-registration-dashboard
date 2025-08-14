import React from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { FilterOptions } from '../types/vehicle';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onExport
}) => {
  const vehicleCategories = ['2W', '3W', '4W'];
  const manufacturers = [
    'Hero MotoCorp', 'Honda', 'TVS', 'Bajaj', 'Yamaha', 'Royal Enfield',
    'Bajaj Auto', 'Mahindra', 'Piaggio', 'Force Motors',
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Honda Cars', 'Toyota', 'Kia'
  ];

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.vehicleCategories.includes(category)
      ? filters.vehicleCategories.filter(c => c !== category)
      : [...filters.vehicleCategories, category];
    
    onFiltersChange({
      ...filters,
      vehicleCategories: updatedCategories
    });
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    const updatedManufacturers = filters.manufacturers.includes(manufacturer)
      ? filters.manufacturers.filter(m => m !== manufacturer)
      : [...filters.manufacturers, manufacturer];
    
    onFiltersChange({
      ...filters,
      manufacturers: updatedManufacturers
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-gray-600" />
          <h3 className="font-medium text-gray-800">Date Range</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Categories */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Vehicle Categories</h3>
        <div className="space-y-2">
          {vehicleCategories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.vehicleCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Manufacturers */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Top Manufacturers</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {manufacturers.slice(0, 10).map((manufacturer) => (
            <label key={manufacturer} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.manufacturers.includes(manufacturer)}
                onChange={() => handleManufacturerToggle(manufacturer)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{manufacturer}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};