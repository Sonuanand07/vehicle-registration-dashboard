@@ .. @@
 import React from 'react';
 import {
   LineChart,
   Line,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend
 } from 'recharts';
 import { ChartDataPoint } from '../types/vehicle';
 import { formatNumber } from '../utils/calculations';
 
 interface GrowthChartProps {
   data: ChartDataPoint[];
   type?: 'line' | 'bar';
   title: string;
   className?: string;
 }
 
 export const GrowthChart: React.FC<GrowthChartProps> = ({
   data,
   type = 'line',
   title,
   className
 }) => {
   const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       return (
-        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
+        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
           <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
           {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-2">
               <div 
                 className="w-3 h-3 rounded-full"
                 style={{ backgroundColor: entry.color }}
               />
               <span className="text-sm text-gray-800">
                 {entry.name}: {formatNumber(entry.value)}
               </span>
             </div>
           ))}
         </div>
       );
     }
     return null;
   };
 
   const formatXAxisLabel = (value: string) => {
     // Format date strings to be more readable
     if (value.includes('-')) {
       const [year, month] = value.split('-');
       if (month) {
         const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
         return `${monthNames[parseInt(month) - 1]} ${year}`;
       }
     }
     return value;
   };
 
   return (
-    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
-      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
+    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
+      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
+        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
+        {title}
+      </h3>
       <div style={{ width: '100%', height: '300px' }}>
         <ResponsiveContainer>
           {type === 'line' ? (
             <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
-              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
+              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
               <XAxis 
                 dataKey="date" 
                 tick={{ fontSize: 12 }}
                 tickFormatter={formatXAxisLabel}
+                stroke="#6b7280"
               />
               <YAxis 
                 tick={{ fontSize: 12 }}
                 tickFormatter={formatNumber}
+                stroke="#6b7280"
               />
               <Tooltip content={<CustomTooltip />} />
               <Legend />
               <Line 
                 type="monotone" 
                 dataKey="value" 
-                stroke="#2563EB" 
-                strokeWidth={3}
-                dot={{ r: 4 }}
-                activeDot={{ r: 6 }}
+                stroke="url(#lineGradient)" 
+                strokeWidth={4}
+                dot={{ r: 5, fill: '#2563EB' }}
+                activeDot={{ r: 8, fill: '#1d4ed8' }}
               />
+              <defs>
+                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
+                  <stop offset="0%" stopColor="#2563EB" />
+                  <stop offset="100%" stopColor="#7c3aed" />
+                </linearGradient>
+              </defs>
             </LineChart>
           ) : (
             <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
-              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
+              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
               <XAxis 
                 dataKey="date" 
                 tick={{ fontSize: 12 }}
                 tickFormatter={formatXAxisLabel}
+                stroke="#6b7280"
               />
               <YAxis 
                 tick={{ fontSize: 12 }}
                 tickFormatter={formatNumber}
+                stroke="#6b7280"
               />
               <Tooltip content={<CustomTooltip />} />
               <Legend />
               <Bar 
                 dataKey="value" 
-                fill="#2563EB"
-                radius={[4, 4, 0, 0]}
+                fill="url(#barGradient)"
+                radius={[6, 6, 0, 0]}
               />
+              <defs>
+                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
+                  <stop offset="0%" stopColor="#2563EB" />
+                  <stop offset="100%" stopColor="#7c3aed" />
+                </linearGradient>
+              </defs>
             </BarChart>
           )}
         </ResponsiveContainer>
       </div>
     </div>
   );
 };