import React from 'react';
import { Calendar, Filter, Download, Car, Bike, Truck } from 'lucide-react';
import { FilterOptions } from '../types/vehicle';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  vehicleCategories: string[];
  manufacturers: string[];
  onExport: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  vehicleCategories,
  manufacturers,
  onExport
}) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '2W': return <Bike size={16} className="text-blue-600" />;
      case '3W': return <Truck size={16} className="text-green-600" />;
      case '4W': return <Car size={16} className="text-purple-600" />;
      default: return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case '2W': return 'Two Wheeler';
      case '3W': return 'Three Wheeler';
      case '4W': return 'Four Wheeler';
      default: return category;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Filter size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Filters
          </h2>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Date Range */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-blue-100 rounded">
            <Calendar size={14} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Date Range</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">Vehicle Categories</h3>
        <div className="space-y-3">
          {vehicleCategories.map((category) => (
            <label key={category} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.vehicleCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <div className="flex items-center gap-2 flex-1">
                {getCategoryIcon(category)}
                <div>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {getCategoryLabel(category)}
                  </span>
                  <div className="text-xs text-gray-500">{category}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Manufacturers */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">Top Manufacturers</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {manufacturers.slice(0, 10).map((manufacturer) => (
            <label key={manufacturer} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.manufacturers.includes(manufacturer)}
                onChange={() => handleManufacturerToggle(manufacturer)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                {manufacturer}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};