"""
Chart Creation Module
Contains functions to create various visualizations for the dashboard
"""

import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

# Color palette for consistent styling
COLORS = {
    'primary': '#2563EB',
    'secondary': '#059669',
    'accent': '#EA580C',
    'success': '#10B981',
    'warning': '#F59E0B',
    'error': '#EF4444',
    'neutral': '#6B7280'
}

CATEGORY_COLORS = {
    '2W': COLORS['primary'],
    '3W': COLORS['secondary'],
    '4W': COLORS['accent']
}

def create_trend_chart(df, title):
    """
    Create a line chart showing registration trends over time
    """
    # Aggregate data by month and category
    monthly_data = df.groupby([df['date'].dt.to_period('M'), 'vehicle_category'])['registrations'].sum().reset_index()
    monthly_data['date'] = monthly_data['date'].dt.to_timestamp()
    
    fig = px.line(
        monthly_data,
        x='date',
        y='registrations',
        color='vehicle_category',
        title=title,
        color_discrete_map=CATEGORY_COLORS,
        labels={
            'registrations': 'Registrations',
            'date': 'Date',
            'vehicle_category': 'Category'
        }
    )
    
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        font=dict(family="Arial, sans-serif", size=12),
        title_font_size=16,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),
        hovermode='x unified'
    )
    
    fig.update_traces(line=dict(width=3), marker=dict(size=6))
    
    return fig

def create_manufacturer_chart(df, chart_type, title):
    """
    Create manufacturer-focused charts (top performers or market share)
    """
    manufacturer_data = df.groupby('manufacturer')['registrations'].sum().reset_index()
    manufacturer_data = manufacturer_data.sort_values('registrations', ascending=False).head(10)
    
    if chart_type == "top_performers":
        fig = px.bar(
            manufacturer_data,
            x='manufacturer',
            y='registrations',
            title=title,
            color='registrations',
            color_continuous_scale='Blues'
        )
        
        fig.update_layout(
            xaxis_tickangle=-45,
            plot_bgcolor='white',
            paper_bgcolor='white',
            font=dict(family="Arial, sans-serif", size=12),
            title_font_size=16
        )
        
    elif chart_type == "market_share":
        fig = px.pie(
            manufacturer_data.head(8),
            values='registrations',
            names='manufacturer',
            title=title,
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        
        fig.update_traces(textposition='inside', textinfo='percent+label')
        fig.update_layout(
            font=dict(family="Arial, sans-serif", size=12),
            title_font_size=16
        )
    
    return fig

def create_growth_indicators(df, title):
    """
    Create a chart showing YoY growth indicators by category
    """
    # Calculate YoY growth for each category
    current_year = df['date'].dt.year.max()
    previous_year = current_year - 1
    
    current_data = df[df['date'].dt.year == current_year].groupby('vehicle_category')['registrations'].sum()
    previous_data = df[df['date'].dt.year == previous_year].groupby('vehicle_category')['registrations'].sum()
    
    growth_data = []
    for category in current_data.index:
        if category in previous_data.index and previous_data[category] > 0:
            growth = ((current_data[category] - previous_data[category]) / previous_data[category]) * 100
        else:
            growth = 0
        
        growth_data.append({
            'category': category,
            'growth': growth,
            'current': current_data[category],
            'previous': previous_data.get(category, 0)
        })
    
    growth_df = pd.DataFrame(growth_data)
    
    # Create bar chart with color coding for positive/negative growth
    colors = ['#10B981' if x >= 0 else '#EF4444' for x in growth_df['growth']]
    
    fig = go.Figure(data=[
        go.Bar(
            x=growth_df['category'],
            y=growth_df['growth'],
            marker_color=colors,
            text=[f"{x:.1f}%" for x in growth_df['growth']],
            textposition='auto',
        )
    ])
    
    fig.update_layout(
        title=title,
        xaxis_title="Vehicle Category",
        yaxis_title="YoY Growth (%)",
        plot_bgcolor='white',
        paper_bgcolor='white',
        font=dict(family="Arial, sans-serif", size=12),
        title_font_size=16,
        showlegend=False
    )
    
    # Add a horizontal line at 0%
    fig.add_hline(y=0, line_dash="dash", line_color="gray", opacity=0.5)
    
    return fig

def create_quarterly_comparison(df, title):
    """
    Create a chart comparing quarterly performance
    """
    # Extract quarter and year information
    df['quarter'] = df['date'].dt.quarter
    df['year_quarter'] = df['date'].dt.year.astype(str) + '-Q' + df['quarter'].astype(str)
    
    quarterly_data = df.groupby(['year_quarter', 'vehicle_category'])['registrations'].sum().reset_index()
    
    fig = px.bar(
        quarterly_data,
        x='year_quarter',
        y='registrations',
        color='vehicle_category',
        title=title,
        color_discrete_map=CATEGORY_COLORS,
        barmode='group'
    )
    
    fig.update_layout(
        xaxis_tickangle=-45,
        plot_bgcolor='white',
        paper_bgcolor='white',
        font=dict(family="Arial, sans-serif", size=12),
        title_font_size=16,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )
    
    return fig

def create_state_wise_analysis(df, title):
    """
    Create a chart showing state-wise registration distribution
    """
    state_data = df.groupby('state')['registrations'].sum().reset_index()
    state_data = state_data.sort_values('registrations', ascending=True)
    
    fig = px.bar(
        state_data,
        x='registrations',
        y='state',
        orientation='h',
        title=title,
        color='registrations',
        color_continuous_scale='Viridis'
    )
    
    fig.update_layout(
        plot_bgcolor='white',
        paper_bgcolor='white',
        font=dict(family="Arial, sans-serif", size=12),
        title_font_size=16,
        height=400
    )
    
    return fig

def create_heatmap_analysis(df, title):
    """
    Create a heatmap showing registrations by month and category
    """
    # Create pivot table for heatmap
    df['month'] = df['date'].dt.month
    heatmap_data = df.groupby(['month', 'vehicle_category'])['registrations'].sum().reset_index()
    pivot_data = heatmap_data.pivot(index='month', columns='vehicle_category', values='registrations')
    
    # Month names for better readability
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    pivot_data.index = [month_names[i-1] for i in pivot_data.index]
    
    fig = px.imshow(
        pivot_data.T,
        title=title,
        color_continuous_scale='Blues',
        aspect='auto'
    )
    
    fig.update_layout(
        font=dict(family="Arial, sans-serif", size=12),
        title_font_size=16
    )
    
    return fig