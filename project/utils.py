"""
Utility Functions Module
Helper functions for data processing and formatting
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def format_number(num):
    """
    Format numbers in Indian numbering system (Lakhs, Crores)
    """
    if pd.isna(num) or num == 0:
        return "0"
    
    if abs(num) >= 10000000:  # 1 Crore
        return f"{num/10000000:.1f}Cr"
    elif abs(num) >= 100000:  # 1 Lakh
        return f"{num/100000:.1f}L"
    elif abs(num) >= 1000:  # 1 Thousand
        return f"{num/1000:.1f}K"
    else:
        return f"{num:,.0f}"

def calculate_percentage_change(current, previous):
    """
    Calculate percentage change between two values
    """
    if previous == 0:
        return 0 if current == 0 else 100
    return ((current - previous) / previous) * 100

def get_date_range_options(df):
    """
    Get available date range options from the dataset
    """
    min_date = df['date'].min().date()
    max_date = df['date'].max().date()
    
    return {
        'min_date': min_date,
        'max_date': max_date,
        'default_start': max_date - timedelta(days=365),  # Last 1 year
        'default_end': max_date
    }

def calculate_market_share(df, group_by='manufacturer'):
    """
    Calculate market share for manufacturers or categories
    """
    total_registrations = df['registrations'].sum()
    
    if group_by == 'manufacturer':
        market_share = df.groupby('manufacturer')['registrations'].sum()
    elif group_by == 'category':
        market_share = df.groupby('vehicle_category')['registrations'].sum()
    else:
        market_share = df.groupby(group_by)['registrations'].sum()
    
    market_share_pct = (market_share / total_registrations * 100).round(2)
    
    return market_share_pct.sort_values(ascending=False)

def get_seasonal_patterns(df):
    """
    Analyze seasonal patterns in vehicle registrations
    """
    df['month'] = df['date'].dt.month
    monthly_avg = df.groupby('month')['registrations'].mean()
    
    # Calculate seasonal index (average month / overall average)
    overall_avg = monthly_avg.mean()
    seasonal_index = (monthly_avg / overall_avg * 100).round(1)
    
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    seasonal_data = pd.DataFrame({
        'Month': month_names,
        'Average_Registrations': monthly_avg.values,
        'Seasonal_Index': seasonal_index.values
    })
    
    return seasonal_data

def identify_growth_leaders(df, period='YoY'):
    """
    Identify growth leaders by manufacturer and category
    """
    current_year = df['date'].dt.year.max()
    
    if period == 'YoY':
        current_data = df[df['date'].dt.year == current_year]
        previous_data = df[df['date'].dt.year == (current_year - 1)]
    elif period == 'QoQ':
        current_quarter = df['date'].dt.quarter.max()
        current_data = df[(df['date'].dt.year == current_year) & 
                         (df['date'].dt.quarter == current_quarter)]
        previous_data = df[(df['date'].dt.year == current_year) & 
                          (df['date'].dt.quarter == (current_quarter - 1))]
    
    growth_leaders = []
    
    # Manufacturer-wise growth
    for manufacturer in df['manufacturer'].unique():
        current_total = current_data[current_data['manufacturer'] == manufacturer]['registrations'].sum()
        previous_total = previous_data[previous_data['manufacturer'] == manufacturer]['registrations'].sum()
        
        if previous_total > 0:
            growth_rate = calculate_percentage_change(current_total, previous_total)
            growth_leaders.append({
                'Type': 'Manufacturer',
                'Name': manufacturer,
                'Current': current_total,
                'Previous': previous_total,
                'Growth_Rate': growth_rate
            })
    
    # Category-wise growth
    for category in df['vehicle_category'].unique():
        current_total = current_data[current_data['vehicle_category'] == category]['registrations'].sum()
        previous_total = previous_data[previous_data['vehicle_category'] == category]['registrations'].sum()
        
        if previous_total > 0:
            growth_rate = calculate_percentage_change(current_total, previous_total)
            growth_leaders.append({
                'Type': 'Category',
                'Name': category,
                'Current': current_total,
                'Previous': previous_total,
                'Growth_Rate': growth_rate
            })
    
    growth_df = pd.DataFrame(growth_leaders)
    return growth_df.sort_values('Growth_Rate', ascending=False)

def validate_data_quality(df):
    """
    Validate data quality and return quality metrics
    """
    quality_metrics = {
        'total_records': len(df),
        'missing_values': df.isnull().sum().sum(),
        'duplicate_records': df.duplicated().sum(),
        'date_range': f"{df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}",
        'unique_manufacturers': df['manufacturer'].nunique(),
        'unique_states': df['state'].nunique(),
        'categories_covered': list(df['vehicle_category'].unique()),
        'data_completeness': f"{((len(df) - df.isnull().sum().sum()) / (len(df) * len(df.columns)) * 100):.1f}%"
    }
    
    return quality_metrics

def export_insights_summary(df, filename='insights_summary.txt'):
    """
    Export key insights to a text file for reporting
    """
    insights = []
    
    # Market share insights
    market_share = calculate_market_share(df, 'manufacturer')
    top_manufacturer = market_share.index[0]
    top_share = market_share.iloc[0]
    
    insights.append(f"Market Leadership: {top_manufacturer} leads with {top_share:.1f}% market share")
    
    # Growth insights
    growth_leaders = identify_growth_leaders(df, 'YoY')
    fastest_growing = growth_leaders.iloc[0]
    
    insights.append(f"Fastest Growing: {fastest_growing['Name']} ({fastest_growing['Type']}) with {fastest_growing['Growth_Rate']:.1f}% YoY growth")
    
    # Seasonal insights
    seasonal_data = get_seasonal_patterns(df)
    peak_month = seasonal_data.loc[seasonal_data['Seasonal_Index'].idxmax(), 'Month']
    
    insights.append(f"Peak Season: {peak_month} shows highest registration activity")
    
    # Category insights
    category_share = calculate_market_share(df, 'category')
    dominant_category = category_share.index[0]
    
    insights.append(f"Dominant Category: {dominant_category} accounts for {category_share.iloc[0]:.1f}% of total registrations")
    
    # Write to file
    with open(filename, 'w') as f:
        f.write("Vehicle Registration Dashboard - Key Insights Summary\n")
        f.write("=" * 60 + "\n\n")
        for insight in insights:
            f.write(f"• {insight}\n")
        f.write(f"\nGenerated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    return insights