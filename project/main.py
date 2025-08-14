"""
Vehicle Registration Dashboard - Main Streamlit App
Author: Backend Developer Intern
Description: Interactive dashboard for vehicle registration data analysis
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_loader import load_and_process_data, get_growth_metrics
from charts import create_trend_chart, create_manufacturer_chart, create_growth_indicators
from utils import format_number, calculate_percentage_change, get_date_range_options

# Page configuration
st.set_page_config(
    page_title="Vehicle Registration Analytics Dashboard",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for investor-friendly styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f2937;
        text-align: center;
        margin-bottom: 1rem;
    }
    .section-header {
        font-size: 1.5rem;
        font-weight: 600;
        color: #374151;
        margin: 2rem 0 1rem 0;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    .insight-box {
        background: #f0f9ff;
        border: 1px solid #0ea5e9;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    .growth-positive {
        color: #059669;
        font-weight: bold;
    }
    .growth-negative {
        color: #dc2626;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown('<h1 class="main-header">🚗 Vehicle Registration Analytics Dashboard</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; color: #6b7280; font-size: 1.1rem;">Investor-focused insights into Indian vehicle registration trends</p>', unsafe_allow_html=True)
    
    # Load data
    with st.spinner('Loading vehicle registration data...'):
        df = load_and_process_data()
    
    if df.empty:
        st.error("No data available. Please check the data source.")
        return
    
    # Sidebar filters
    st.sidebar.markdown("## 📊 Dashboard Filters")
    
    # Date range selection
    st.sidebar.markdown("### 📅 Date Range")
    date_options = get_date_range_options(df)
    
    col1, col2 = st.sidebar.columns(2)
    with col1:
        start_date = st.date_input(
            "From",
            value=date_options['min_date'],
            min_value=date_options['min_date'],
            max_value=date_options['max_date']
        )
    with col2:
        end_date = st.date_input(
            "To",
            value=date_options['max_date'],
            min_value=date_options['min_date'],
            max_value=date_options['max_date']
        )
    
    # Vehicle category filter
    st.sidebar.markdown("### 🏍️ Vehicle Categories")
    available_categories = sorted(df['vehicle_category'].unique())
    selected_categories = st.sidebar.multiselect(
        "Select Categories",
        available_categories,
        default=available_categories
    )
    
    # Manufacturer filter
    st.sidebar.markdown("### 🏭 Manufacturers")
    available_manufacturers = sorted(df['manufacturer'].unique())
    selected_manufacturers = st.sidebar.multiselect(
        "Select Manufacturers (Top 10 shown)",
        available_manufacturers[:10],
        default=available_manufacturers[:5]
    )
    
    # Filter data based on selections
    filtered_df = df[
        (df['date'] >= pd.to_datetime(start_date)) &
        (df['date'] <= pd.to_datetime(end_date)) &
        (df['vehicle_category'].isin(selected_categories)) &
        (df['manufacturer'].isin(selected_manufacturers) if selected_manufacturers else True)
    ]
    
    if filtered_df.empty:
        st.warning("No data available for the selected filters. Please adjust your selection.")
        return
    
    # Key Metrics Section
    st.markdown('<h2 class="section-header">📈 Overall Vehicle Registration Trends</h2>', unsafe_allow_html=True)
    
    # Calculate key metrics
    total_registrations = filtered_df['registrations'].sum()
    growth_metrics = get_growth_metrics(filtered_df)
    
    # Display metrics in columns
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Registrations",
            value=format_number(total_registrations),
            delta=f"{growth_metrics['total_yoy_growth']:.1f}% YoY"
        )
    
    with col2:
        two_wheeler_total = filtered_df[filtered_df['vehicle_category'] == '2W']['registrations'].sum()
        st.metric(
            label="2W Registrations",
            value=format_number(two_wheeler_total),
            delta=f"{growth_metrics['2w_yoy_growth']:.1f}% YoY"
        )
    
    with col3:
        four_wheeler_total = filtered_df[filtered_df['vehicle_category'] == '4W']['registrations'].sum()
        st.metric(
            label="4W Registrations",
            value=format_number(four_wheeler_total),
            delta=f"{growth_metrics['4w_yoy_growth']:.1f}% YoY"
        )
    
    with col4:
        three_wheeler_total = filtered_df[filtered_df['vehicle_category'] == '3W']['registrations'].sum()
        st.metric(
            label="3W Registrations",
            value=format_number(three_wheeler_total),
            delta=f"{growth_metrics['3w_yoy_growth']:.1f}% YoY"
        )
    
    # Trend Charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.plotly_chart(
            create_trend_chart(filtered_df, "Monthly Registration Trends"),
            use_container_width=True
        )
    
    with col2:
        st.plotly_chart(
            create_growth_indicators(filtered_df, "YoY Growth by Category"),
            use_container_width=True
        )
    
    # Manufacturer Insights Section
    st.markdown('<h2 class="section-header">🏭 Manufacturer Insights</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.plotly_chart(
            create_manufacturer_chart(filtered_df, "top_performers", "Top Performing Manufacturers"),
            use_container_width=True
        )
    
    with col2:
        st.plotly_chart(
            create_manufacturer_chart(filtered_df, "market_share", "Market Share Distribution"),
            use_container_width=True
        )
    
    # Growth Analysis Section
    st.markdown('<h2 class="section-header">📊 Growth Analysis</h2>', unsafe_allow_html=True)
    
    # Growth table
    growth_df = pd.DataFrame([
        {
            'Category': 'Two Wheeler (2W)',
            'Current Registrations': format_number(two_wheeler_total),
            'YoY Growth': f"{growth_metrics['2w_yoy_growth']:.1f}%",
            'QoQ Growth': f"{growth_metrics['2w_qoq_growth']:.1f}%"
        },
        {
            'Category': 'Three Wheeler (3W)',
            'Current Registrations': format_number(three_wheeler_total),
            'YoY Growth': f"{growth_metrics['3w_yoy_growth']:.1f}%",
            'QoQ Growth': f"{growth_metrics['3w_qoq_growth']:.1f}%"
        },
        {
            'Category': 'Four Wheeler (4W)',
            'Current Registrations': format_number(four_wheeler_total),
            'YoY Growth': f"{growth_metrics['4w_yoy_growth']:.1f}%",
            'QoQ Growth': f"{growth_metrics['4w_qoq_growth']:.1f}%"
        }
    ])
    
    st.dataframe(growth_df, use_container_width=True)
    
    # Key Insights Box
    st.markdown('<h2 class="section-header">💡 Key Investor Insights</h2>', unsafe_allow_html=True)
    
    # Calculate insights
    fastest_growing = max(growth_metrics['2w_yoy_growth'], growth_metrics['3w_yoy_growth'], growth_metrics['4w_yoy_growth'])
    fastest_category = '2W' if fastest_growing == growth_metrics['2w_yoy_growth'] else ('3W' if fastest_growing == growth_metrics['3w_yoy_growth'] else '4W')
    
    top_manufacturer = filtered_df.groupby('manufacturer')['registrations'].sum().idxmax()
    top_manufacturer_share = (filtered_df[filtered_df['manufacturer'] == top_manufacturer]['registrations'].sum() / total_registrations) * 100
    
    seasonal_analysis = filtered_df.groupby(filtered_df['date'].dt.month)['registrations'].mean()
    peak_month = seasonal_analysis.idxmax()
    peak_month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][peak_month-1]
    
    insights_html = f"""
    <div class="insight-box">
        <h3 style="color: #0ea5e9; margin-bottom: 1rem;">🎯 Investment Opportunities & Market Trends</h3>
        <ul style="line-height: 1.8;">
            <li><strong>Fastest Growing Segment:</strong> {fastest_category} category is leading with {fastest_growing:.1f}% YoY growth, indicating strong market momentum</li>
            <li><strong>Market Leadership:</strong> {top_manufacturer} dominates with {top_manufacturer_share:.1f}% market share, showing consolidation opportunities</li>
            <li><strong>Seasonal Pattern:</strong> Peak registrations occur in {peak_month_name}, suggesting optimal timing for market entry and inventory planning</li>
            <li><strong>EV Transition:</strong> Electric vehicle adoption is accelerating, particularly in urban markets - a key growth driver for investors</li>
            <li><strong>Rural Penetration:</strong> Significant untapped potential in Tier-2 and Tier-3 cities for market expansion</li>
        </ul>
    </div>
    """
    st.markdown(insights_html, unsafe_allow_html=True)
    
    # Data Export
    st.markdown('<h2 class="section-header">📥 Data Export</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        csv = filtered_df.to_csv(index=False)
        st.download_button(
            label="📊 Download Filtered Data (CSV)",
            data=csv,
            file_name=f"vehicle_registration_data_{start_date}_{end_date}.csv",
            mime="text/csv"
        )
    
    with col2:
        summary_data = {
            'Metric': ['Total Registrations', '2W Share', '3W Share', '4W Share', 'Top Manufacturer'],
            'Value': [
                format_number(total_registrations),
                f"{(two_wheeler_total/total_registrations)*100:.1f}%",
                f"{(three_wheeler_total/total_registrations)*100:.1f}%",
                f"{(four_wheeler_total/total_registrations)*100:.1f}%",
                top_manufacturer
            ]
        }
        summary_csv = pd.DataFrame(summary_data).to_csv(index=False)
        st.download_button(
            label="📈 Download Summary Report (CSV)",
            data=summary_csv,
            file_name=f"vehicle_summary_{start_date}_{end_date}.csv",
            mime="text/csv"
        )
    
    # Footer
    st.markdown("---")
    st.markdown(
        '<p style="text-align: center; color: #6b7280;">Data Source: Vahan Dashboard (Mock Data for Demonstration) | '
        f'Last Updated: {datetime.now().strftime("%B %Y")}</p>',
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()