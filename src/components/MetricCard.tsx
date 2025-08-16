@@ .. @@
 import React from 'react';
-import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
+import { TrendingUp, TrendingDown, Minus, Car, Bike, Truck } from 'lucide-react';
 import { clsx } from 'clsx';
 import { formatNumber, formatPercentage } from '../utils/calculations';
 
 interface MetricCardProps {
   title: string;
   value: number;
   change: number;
   changeType: 'YoY' | 'QoQ';
+  category?: string;
   className?: string;
 }
 
 export const MetricCard: React.FC<MetricCardProps> = ({
   title,
   value,
   change,
   changeType,
+  category,
   className
 }) => {
   const isPositive = change > 0;
   const isNeutral = change === 0;
   const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
   
+  const getCategoryIcon = () => {
+    if (!category) return null;
+    switch (category) {
+      case '2W': return <Bike size={24} className="text-blue-500" />;
+      case '3W': return <Truck size={24} className="text-green-500" />;
+      case '4W': return <Car size={24} className="text-purple-500" />;
+      default: return null;
+    }
+  };
+
+  const getGradientClass = () => {
+    if (!category) return 'from-blue-500 to-purple-600';
+    switch (category) {
+      case '2W': return 'from-blue-500 to-blue-600';
+      case '3W': return 'from-green-500 to-green-600';
+      case '4W': return 'from-purple-500 to-purple-600';
+      default: return 'from-blue-500 to-purple-600';
+    }
+  };
+
   return (
     <div className={clsx(
-      "bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md",
+      "bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden",
       className
     )}>
+      {/* Background gradient */}
+      <div className={clsx(
+        "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-full",
+        getGradientClass()
+      )} />
+      
       <div className="flex items-start justify-between">
         <div className="flex-1">
-          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
-          <p className="text-2xl font-bold text-gray-900 mb-2">
+          <div className="flex items-center gap-2 mb-2">
+            {getCategoryIcon()}
+            <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
+          </div>
+          <p className="text-3xl font-bold text-gray-900 mb-3">
             {formatNumber(value)}
           </p>
-          <div className="flex items-center gap-1">
+          <div className="flex items-center gap-2">
             <Icon 
-              size={16} 
+              size={18} 
               className={clsx(
                 isNeutral ? 'text-gray-400' : 
                 isPositive ? 'text-emerald-600' : 'text-red-600'
               )}
             />
             <span className={clsx(
-              "text-sm font-medium",
+              "text-sm font-bold",
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