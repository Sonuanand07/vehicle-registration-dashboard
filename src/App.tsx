@@ .. @@
 import React, { useState, useMemo } from 'react';
-import { BarChart3, TrendingUp, Calendar, Users } from 'lucide-react';
+import { BarChart3, TrendingUp, Calendar, Users, Sparkles, Target, Award } from 'lucide-react';
 import { FilterPanel } from './components/FilterPanel';
 import { MetricCard } from './components/MetricCard';
 import { GrowthChart } from './components/GrowthChart';
 import { GrowthTable } from './components/GrowthTable';
 import { mockData } from './data/mockData';
 import { FilterOptions, VehicleData } from './types/vehicle';
 import { calculateGrowthMetrics, formatNumber, aggregateDataByPeriod } from './utils/calculations';
 
 function App() {
   const [filters, setFilters] = useState<FilterOptions>({
     dateRange: {
       start: '2022-01-01',
       end: '2024-12-31'
     },
     vehicleCategories: ['2W', '3W', '4W'],
     manufacturers: [],
     states: []
   });
 
   // Filter data based on current filters
   const filteredData = useMemo(() => {
     return mockData.filter((item: VehicleData) => {
       const itemDate = new Date(item.date);
       const startDate = new Date(filters.dateRange.start);
       const endDate = new Date(filters.dateRange.end);
       
       return (
         itemDate >= startDate &&
         itemDate <= endDate &&
         filters.vehicleCategories.includes(item.vehicleCategory) &&
         (filters.manufacturers.length === 0 || filters.manufacturers.includes(item.manufacturer))
       );
     });
   }, [filters]);
 
   // Calculate growth metrics
   const categoryGrowth = useMemo(() => 
     calculateGrowthMetrics(filteredData, 'category'), 
     [filteredData]
   );
 
   const manufacturerGrowth = useMemo(() => 
     calculateGrowthMetrics(filteredData, 'manufacturer').slice(0, 15), 
     [filteredData]
   );
 
   // Prepare chart data
   const monthlyTrends = useMemo(() => {
     const aggregated = aggregateDataByPeriod(filteredData, 'month');
     return Object.entries(aggregated)
       .sort(([a], [b]) => a.localeCompare(b))
       .map(([date, value]) => ({ date, value }));
   }, [filteredData]);
 
   const categoryTrends = useMemo(() => {
     const categoryData: Record<string, Record<string, number>> = {};
     
     filteredData.forEach(item => {
       const month = item.date.substring(0, 7); // YYYY-MM
       if (!categoryData[month]) categoryData[month] = {};
       categoryData[month][item.vehicleCategory] = 
         (categoryData[month][item.vehicleCategory] || 0) + item.registrations;
     });
 
     return Object.entries(categoryData)
       .sort(([a], [b]) => a.localeCompare(b))
       .map(([date, categories]) => ({
         date,
         '2W': categories['2W'] || 0,
         '3W': categories['3W'] || 0,
         '4W': categories['4W'] || 0
       }));
   }, [filteredData]);
 
   // Calculate total metrics
   const totalRegistrations = filteredData.reduce((sum, item) => sum + item.registrations, 0);
   const totalYoYGrowth = categoryGrowth.length > 0 
     ? categoryGrowth.reduce((sum, item) => sum + item.yoyGrowth, 0) / categoryGrowth.length 
     : 0;
-  const totalQoQGrowth = categoryGrowth.length > 0 
-    ? categoryGrowth.reduce((sum, item) => sum + item.qoqGrowth, 0) / categoryGrowth.length 
-    : 0;
+
+  // Calculate individual category metrics
+  const twoWheelerData = categoryGrowth.find(c => c.category === '2W');
+  const threeWheelerData = categoryGrowth.find(c => c.category === '3W');
+  const fourWheelerData = categoryGrowth.find(c => c.category === '4W');
 
   const handleExport = () => {
     const csvData = [
       ['Category', 'Manufacturer', 'Current Registrations', 'YoY Growth (%)', 'QoQ Growth (%)'],
       ...manufacturerGrowth.map(item => [
         item.category,
         item.manufacturer || 'All',
         item.currentValue,
         item.yoyGrowth.toFixed(1),
         item.qoqGrowth.toFixed(1)
       ])
     ];
     
     const csvContent = csvData.map(row => row.join(',')).join('\n');
     const blob = new Blob([csvContent], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = 'vehicle-registration-data.csv';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     window.URL.revokeObjectURL(url);
   };
 
   return (
-    <div className="min-h-screen bg-gray-50">
+    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
       {/* Header */}
-      <header className="bg-white border-b border-gray-200">
+      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex items-center gap-3">
-            <div className="p-2 bg-blue-600 rounded-lg">
-              <BarChart3 size={24} className="text-white" />
+            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
+              <BarChart3 size={28} className="text-white" />
             </div>
             <div>
-              <h1 className="text-2xl font-bold text-gray-900">
+              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 Vehicle Registration Analytics Dashboard
               </h1>
-              <p className="text-gray-600">
+              <p className="text-gray-600 font-medium">
                 Investor-focused insights into Indian vehicle registration trends
               </p>
             </div>
           </div>
         </div>
       </header>
 
       <div className="max-w-7xl mx-auto px-6 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Filters Sidebar */}
           <div className="lg:col-span-1">
             <FilterPanel
               filters={filters}
               onFiltersChange={setFilters}
               onExport={handleExport}
             />
           </div>
 
           {/* Main Content */}
           <div className="lg:col-span-3 space-y-8">
             {/* Key Metrics */}
-            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
+            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               <MetricCard
                 title="Total Registrations"
                 value={totalRegistrations}
                 change={totalYoYGrowth}
                 changeType="YoY"
               />
               <MetricCard
                 title="2W Registrations"
-                value={categoryGrowth.find(c => c.category === '2W')?.currentValue || 0}
-                change={categoryGrowth.find(c => c.category === '2W')?.yoyGrowth || 0}
+                value={twoWheelerData?.currentValue || 0}
+                change={twoWheelerData?.yoyGrowth || 0}
                 changeType="YoY"
+                category="2W"
+              />
+              <MetricCard
+                title="3W Registrations"
+                value={threeWheelerData?.currentValue || 0}
+                change={threeWheelerData?.yoyGrowth || 0}
+                changeType="YoY"
+                category="3W"
               />
               <MetricCard
                 title="4W Registrations"
-                value={categoryGrowth.find(c => c.category === '4W')?.currentValue || 0}
-                change={categoryGrowth.find(c => c.category === '4W')?.yoyGrowth || 0}
+                value={fourWheelerData?.currentValue || 0}
+                change={fourWheelerData?.yoyGrowth || 0}
                 changeType="YoY"
+                category="4W"
               />
             </div>
 
             {/* Charts */}
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <GrowthChart
                 data={monthlyTrends}
                 type="line"
                 title="Monthly Registration Trends"
               />
               <GrowthChart
                 data={monthlyTrends.slice(-12)}
                 type="bar"
                 title="Last 12 Months Performance"
               />
             </div>
 
             {/* Growth Tables */}
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <GrowthTable
                 data={categoryGrowth}
                 title="Category Growth Analysis"
                 showManufacturer={false}
               />
               <GrowthTable
                 data={manufacturerGrowth}
                 title="Top Manufacturers Performance"
                 showManufacturer={true}
               />
             </div>
 
             {/* Investment Insights */}
-            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
+            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
               <div className="flex items-start gap-3">
-                <div className="p-2 bg-blue-600 rounded-lg">
-                  <TrendingUp size={20} className="text-white" />
+                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
+                  <Sparkles size={24} className="text-white" />
                 </div>
                 <div>
-                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
+                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                     Key Investment Insights
                   </h3>
-                  <div className="space-y-2 text-sm text-gray-700">
-                    <p>• <strong>2W Market Dominance:</strong> Two-wheelers continue to lead with {formatNumber(categoryGrowth.find(c => c.category === '2W')?.currentValue || 0)} registrations</p>
-                    <p>• <strong>EV Growth Opportunity:</strong> Electric vehicle adoption accelerating in urban markets</p>
-                    <p>• <strong>Seasonal Patterns:</strong> Q3-Q4 typically show 30% higher registrations due to festival demand</p>
-                    <p>• <strong>Market Consolidation:</strong> Top 5 manufacturers control ~75% of market share</p>
-                    <p>• <strong>Rural Penetration:</strong> Significant growth potential in Tier-2 and Tier-3 cities</p>
+                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
+                    <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
+                      <Target size={20} className="text-blue-600 mt-1" />
+                      <div>
+                        <h4 className="font-semibold text-gray-800 mb-1">Market Leadership</h4>
+                        <p className="text-sm text-gray-700">2W dominates with {formatNumber(twoWheelerData?.currentValue || 0)} registrations</p>
+                      </div>
+                    </div>
+                    <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
+                      <TrendingUp size={20} className="text-green-600 mt-1" />
+                      <div>
+                        <h4 className="font-semibold text-gray-800 mb-1">Growth Opportunity</h4>
+                        <p className="text-sm text-gray-700">EV adoption accelerating in urban markets</p>
+                      </div>
+                    </div>
+                    <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
+                      <Calendar size={20} className="text-purple-600 mt-1" />
+                      <div>
+                        <h4 className="font-semibold text-gray-800 mb-1">Seasonal Patterns</h4>
+                        <p className="text-sm text-gray-700">Q3-Q4 show 30% higher registrations</p>
+                      </div>
+                    </div>
+                    <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
+                      <Award size={20} className="text-orange-600 mt-1" />
+                      <div>
+                        <h4 className="font-semibold text-gray-800 mb-1">Market Share</h4>
+                        <p className="text-sm text-gray-700">Top 5 manufacturers control ~75% share</p>
+                      </div>
+                    </div>
+                  </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
 
       {/* Footer */}
-      <footer className="bg-white border-t border-gray-200 mt-16">
+      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16">
         <div className="max-w-7xl mx-auto px-6 py-6">
           <div className="flex items-center justify-between">
-            <p className="text-sm text-gray-600">
+            <p className="text-sm text-gray-600 font-medium">
               Data Source: Vahan Dashboard (Mock Data for Demonstration)
             </p>
             <div className="flex items-center gap-4 text-sm text-gray-600">
               <span className="flex items-center gap-1">
                 <Calendar size={14} />
                 Updated: December 2024
               </span>
               <span className="flex items-center gap-1">
                 <Users size={14} />
                 {formatNumber(totalRegistrations)} Total Registrations
               </span>
             </div>
           </div>
         </div>
       </footer>
     </div>
   );
 }
 
 export default App;