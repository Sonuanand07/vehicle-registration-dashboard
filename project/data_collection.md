# Vehicle Registration Data Collection Guide

## Overview
This document outlines the data collection process for the Vehicle Registration Dashboard, including scraping methodology, data sources, and processing steps.

## Data Source
**Primary Source**: Vahan Dashboard (https://vahan.parivahan.gov.in/vahan4dashboard/vahan/view/reportview.xhtml)

### Available Data Points
- Vehicle Category (2W, 3W, 4W)
- Vehicle Class (MOTORCYCLE, SCOOTER, MOTOR CAR, etc.)
- Manufacturer information
- State-wise registration data
- RTO (Regional Transport Office) details
- Time-series data (monthly/quarterly)

## Data Collection Methods

### Method 1: Web Scraping (Recommended for Production)
```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_vahan_data(start_date, end_date, state='All'):
    """
    Scrape vehicle registration data from Vahan Dashboard
    """
    base_url = "https://vahan.parivahan.gov.in/vahan4dashboard/vahan/view/reportview.xhtml"
    
    # Session for maintaining cookies
    session = requests.Session()
    
    # Headers to mimic browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
    }
    
    # Implementation would include:
    # 1. Form data preparation
    # 2. POST request to get data
    # 3. HTML parsing with BeautifulSoup
    # 4. Data extraction and cleaning
    # 5. Rate limiting to respect server resources
    
    pass  # Actual implementation would go here
```

### Method 2: API Integration (If Available)
```python
def fetch_vahan_api_data(api_key, params):
    """
    Fetch data using official Vahan API (if available)
    """
    api_endpoint = "https://api.vahan.gov.in/v1/registrations"
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(api_endpoint, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API request failed: {response.status_code}")
```

### Method 3: Manual Data Download (Current Implementation)
For demonstration purposes, we're using realistic mock data that simulates the structure and patterns of actual Vahan data.

## Data Processing Pipeline

### Step 1: Raw Data Extraction
```python
def extract_raw_data():
    """
    Extract raw data from source
    """
    # Web scraping or API calls
    # Save raw data to staging area
    pass
```

### Step 2: Data Cleaning
```python
def clean_data(raw_df):
    """
    Clean and standardize the data
    """
    # Remove duplicates
    # Handle missing values
    # Standardize manufacturer names
    # Validate date formats
    # Convert data types
    
    cleaned_df = raw_df.copy()
    
    # Example cleaning steps:
    cleaned_df = cleaned_df.drop_duplicates()
    cleaned_df['date'] = pd.to_datetime(cleaned_df['date'])
    cleaned_df['registrations'] = pd.to_numeric(cleaned_df['registrations'], errors='coerce')
    
    return cleaned_df
```

### Step 3: Data Validation
```python
def validate_data(df):
    """
    Validate data quality and completeness
    """
    validation_results = {
        'total_records': len(df),
        'missing_values': df.isnull().sum().to_dict(),
        'date_range': (df['date'].min(), df['date'].max()),
        'unique_manufacturers': df['manufacturer'].nunique(),
        'data_quality_score': calculate_quality_score(df)
    }
    
    return validation_results
```

### Step 4: Data Storage
```python
def store_processed_data(df):
    """
    Store processed data in database and CSV
    """
    # Save to SQLite database
    df.to_sql('vehicle_registrations', conn, if_exists='replace')
    
    # Save to CSV for backup
    df.to_csv('data/processed_vehicle_data.csv', index=False)
    
    # Create data dictionary
    create_data_dictionary(df)
```

## Data Schema

### Main Table: vehicle_registrations
| Column | Type | Description |
|--------|------|-------------|
| date | DATE | Registration date (YYYY-MM-DD) |
| vehicle_category | VARCHAR(5) | Vehicle category (2W, 3W, 4W) |
| vehicle_class | VARCHAR(50) | Specific vehicle class |
| manufacturer | VARCHAR(100) | Manufacturer name |
| state | VARCHAR(50) | State name |
| rto | VARCHAR(10) | RTO code |
| registrations | INTEGER | Number of registrations |
| quarter | VARCHAR(10) | Quarter (YYYY-Q1/Q2/Q3/Q4) |
| year | INTEGER | Year |

## Data Quality Checks

### Automated Validation Rules
1. **Date Validation**: All dates must be valid and within expected range
2. **Category Validation**: Vehicle categories must be 2W, 3W, or 4W
3. **Numeric Validation**: Registration counts must be positive integers
4. **Completeness Check**: No critical fields should be null
5. **Consistency Check**: Manufacturer names should be standardized

### Data Quality Metrics
- **Completeness**: Percentage of non-null values
- **Accuracy**: Validation against known patterns
- **Consistency**: Standardization of categorical values
- **Timeliness**: Data freshness and update frequency

## Ethical Considerations

### Web Scraping Guidelines
1. **Respect robots.txt**: Always check and follow robots.txt rules
2. **Rate Limiting**: Implement delays between requests (1-2 seconds minimum)
3. **User-Agent**: Use appropriate User-Agent headers
4. **Terms of Service**: Comply with website terms of service
5. **Data Usage**: Use data only for legitimate analytical purposes

### Legal Compliance
- Ensure compliance with data protection regulations
- Respect intellectual property rights
- Follow government data usage policies
- Maintain data security and privacy

## Update Schedule

### Recommended Update Frequency
- **Daily**: For real-time dashboards
- **Weekly**: For trend analysis
- **Monthly**: For comprehensive reports
- **Quarterly**: For strategic planning

### Automated Pipeline
```python
def scheduled_data_update():
    """
    Automated data update pipeline
    """
    try:
        # Extract new data
        new_data = extract_raw_data()
        
        # Process and validate
        processed_data = clean_data(new_data)
        validation_results = validate_data(processed_data)
        
        # Store if validation passes
        if validation_results['data_quality_score'] > 0.8:
            store_processed_data(processed_data)
            log_success("Data update completed successfully")
        else:
            log_error("Data quality check failed")
            
    except Exception as e:
        log_error(f"Data update failed: {str(e)}")
        send_alert("Data pipeline failure")
```

## Troubleshooting

### Common Issues
1. **Website Structure Changes**: Regular monitoring and code updates needed
2. **Rate Limiting**: Implement exponential backoff
3. **Data Format Changes**: Flexible parsing with error handling
4. **Network Issues**: Retry mechanisms and timeout handling

### Monitoring and Alerts
- Set up monitoring for data pipeline health
- Configure alerts for data quality issues
- Implement logging for debugging
- Create dashboards for pipeline monitoring

## Future Enhancements

### Planned Improvements
1. **Real-time Data Streaming**: Implement real-time data ingestion
2. **Advanced Analytics**: Add predictive modeling capabilities
3. **Data Enrichment**: Integrate additional data sources
4. **API Development**: Create APIs for data access
5. **Machine Learning**: Implement anomaly detection

### Scalability Considerations
- Implement distributed processing for large datasets
- Use cloud storage for data archival
- Optimize database queries for performance
- Consider data partitioning strategies