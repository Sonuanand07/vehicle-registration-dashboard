"""
Data Loading and Processing Module
Handles data fetching, cleaning, and preparation for the dashboard
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sqlite3
import os

def generate_mock_data():
    """
    Generate realistic mock data based on Indian vehicle registration patterns
    This simulates data that would be scraped from Vahan Dashboard
    """
    np.random.seed(42)  # For reproducible results
    
    # Define realistic data parameters
    manufacturers = {
        '2W': ['Hero MotoCorp', 'Honda', 'TVS', 'Bajaj', 'Yamaha', 'Royal Enfield'],
        '3W': ['Bajaj Auto', 'Mahindra', 'TVS', 'Piaggio', 'Force Motors'],
        '4W': ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Honda Cars', 'Toyota', 'Kia']
    }
    
    states = ['Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Uttar Pradesh', 'Delhi', 'West Bengal', 'Rajasthan']
    vehicle_classes = {
        '2W': ['MOTORCYCLE', 'SCOOTER', 'MOPED'],
        '3W': ['AUTO RICKSHAW', '3W GOODS VEHICLE', 'E-RICKSHAW'],
        '4W': ['MOTOR CAR', 'SUV', 'COMMERCIAL VEHICLE', 'BUS']
    }
    
    data = []
    
    # Generate data for last 3 years with realistic patterns
    for year in range(2022, 2025):
        for month in range(1, 13):
            for category in ['2W', '3W', '4W']:
                for manufacturer in manufacturers[category]:
                    for state in states[:5]:  # Limit states for demo
                        # Seasonal multiplier - higher sales in Q3 and Q4 (festival season)
                        seasonal_multiplier = 1.3 if month >= 7 and month <= 12 else 0.9
                        
                        # Base registrations with realistic proportions
                        base_registrations = {
                            '2W': np.random.randint(5000, 20000),
                            '3W': np.random.randint(500, 3000),
                            '4W': np.random.randint(2000, 10000)
                        }
                        
                        # Market share adjustments
                        market_share_multiplier = 1.4 if manufacturer in ['Hero MotoCorp', 'Maruti Suzuki'] else \
                                                 1.2 if manufacturer in ['Honda', 'Hyundai'] else 1.0
                        
                        # Year-over-year growth
                        yoy_multiplier = 1.15 if year == 2024 else (1.08 if year == 2023 else 1.0)
                        
                        registrations = int(
                            base_registrations[category] * 
                            seasonal_multiplier * 
                            market_share_multiplier * 
                            yoy_multiplier *
                            np.random.uniform(0.8, 1.2)  # Add some randomness
                        )
                        
                        quarter = f"Q{(month-1)//3 + 1}"
                        date = f"{year}-{month:02d}-01"
                        
                        data.append({
                            'date': date,
                            'vehicle_category': category,
                            'vehicle_class': np.random.choice(vehicle_classes[category]),
                            'manufacturer': manufacturer,
                            'state': state,
                            'rto': f"{state[:2].upper()}{np.random.randint(1, 99):02d}",
                            'registrations': registrations,
                            'quarter': f"{year}-{quarter}",
                            'year': year
                        })
    
    return pd.DataFrame(data)

def load_and_process_data():
    """
    Load and process vehicle registration data
    In production, this would connect to the actual Vahan API or database
    """
    try:
        # Check if processed data exists
        if os.path.exists('data/processed_vehicle_data.csv'):
            df = pd.read_csv('data/processed_vehicle_data.csv')
            df['date'] = pd.to_datetime(df['date'])
        else:
            # Generate mock data (in production, this would be actual data scraping)
            df = generate_mock_data()
            df['date'] = pd.to_datetime(df['date'])
            
            # Create data directory and save processed data
            os.makedirs('data', exist_ok=True)
            df.to_csv('data/processed_vehicle_data.csv', index=False)
        
        return df
    
    except Exception as e:
        print(f"Error loading data: {e}")
        return pd.DataFrame()

def get_growth_metrics(df):
    """
    Calculate YoY and QoQ growth metrics for different vehicle categories
    """
    current_date = df['date'].max()
    previous_year_date = current_date - timedelta(days=365)
    previous_quarter_date = current_date - timedelta(days=90)
    
    # Current period data
    current_data = df[df['date'] >= previous_quarter_date]
    
    # Previous year same period
    prev_year_start = previous_year_date - timedelta(days=90)
    prev_year_data = df[(df['date'] >= prev_year_start) & (df['date'] < previous_year_date)]
    
    # Previous quarter data
    prev_quarter_start = previous_quarter_date - timedelta(days=90)
    prev_quarter_data = df[(df['date'] >= prev_quarter_start) & (df['date'] < previous_quarter_date)]
    
    def calculate_growth(current, previous):
        if previous == 0:
            return 0
        return ((current - previous) / previous) * 100
    
    # Calculate metrics for each category
    metrics = {}
    
    for category in ['2W', '3W', '4W']:
        current_total = current_data[current_data['vehicle_category'] == category]['registrations'].sum()
        prev_year_total = prev_year_data[prev_year_data['vehicle_category'] == category]['registrations'].sum()
        prev_quarter_total = prev_quarter_data[prev_quarter_data['vehicle_category'] == category]['registrations'].sum()
        
        metrics[f'{category.lower()}_yoy_growth'] = calculate_growth(current_total, prev_year_total)
        metrics[f'{category.lower()}_qoq_growth'] = calculate_growth(current_total, prev_quarter_total)
    
    # Total metrics
    current_total = current_data['registrations'].sum()
    prev_year_total = prev_year_data['registrations'].sum()
    prev_quarter_total = prev_quarter_data['registrations'].sum()
    
    metrics['total_yoy_growth'] = calculate_growth(current_total, prev_year_total)
    metrics['total_qoq_growth'] = calculate_growth(current_total, prev_quarter_total)
    
    return metrics

def save_to_database(df, db_path='data/vehicle_registrations.db'):
    """
    Save processed data to SQLite database for efficient querying
    """
    try:
        os.makedirs('data', exist_ok=True)
        conn = sqlite3.connect(db_path)
        df.to_sql('registrations', conn, if_exists='replace', index=False)
        conn.close()
        print(f"Data saved to database: {db_path}")
    except Exception as e:
        print(f"Error saving to database: {e}")

def query_database(query, db_path='data/vehicle_registrations.db'):
    """
    Execute SQL queries on the vehicle registration database
    """
    try:
        conn = sqlite3.connect(db_path)
        result = pd.read_sql_query(query, conn)
        conn.close()
        return result
    except Exception as e:
        print(f"Error querying database: {e}")
        return pd.DataFrame()