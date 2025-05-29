import logging
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from datetime import datetime, timedelta
from collections import defaultdict
import joblib
import os

# Create a folder for saved forecasts if not exists
os.makedirs("saved_forecasts", exist_ok=True)

# Save predictions dictionary to a file (optional: timestamped)
joblib.dump(predictions, "saved_forecasts/latest_forecasts.pkl")



# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Month to number mapping
MONTH_MAP = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4,
    'may': 5, 'jun': 6, 'jul': 7, 'aug': 8,
    'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
}

def parse_weekly_data(weekly_records):
    """Convert your weekly spreadsheet format to time series data"""
    processed_data = []
    
    for week_record in weekly_records:
        # Extract week information
        week_str = week_record.get('week', '').lower()
        if not week_str:
            continue
            
        # Parse month and week number
        try:
            month_part, week_part = week_str.split(' week ')
            month = MONTH_MAP[month_part.strip()]
            week_num = int(week_part.strip())
            base_date = datetime(2023, month, 1 + (week_num-1)*7)
        except Exception as e:
            logger.error(f"Error parsing week {week_str}: {e}")
            continue

        # Process each day in the week
        for day in range(1, 8):  # Days 1-7
            record_date = base_date + timedelta(days=day-1)
            
            # Extract all categories for this day
            for col_name, value in week_record.items():
                if col_name == 'week':
                    continue
                
                if f'_day_{day}' in col_name:
                    category = col_name.split('_day_')[0]
                    try:
                        amount = float(value) if value else 0.0
                        processed_data.append({
                            'date': record_date,
                            'category': category,
                            'amount': amount
                        })
                    except ValueError:
                        continue

    return pd.DataFrame(processed_data)


def simplify_expenses(raw_expenses):
    simplified = []
    for entry in raw_expenses:
        simplified.append({
            'id': entry.get('id'),
            'amount': entry.get('amount'),
            'description': entry.get('description', ''),
            'category': entry.get('category'),
            'date': entry.get('date'),
            'user': {
                'id': entry.get('user', {}).get('id'),
                'username': entry.get('user', {}).get('username')
            }
        })
    return simplified

def parse_date_safe(date_input):
    if isinstance(date_input, list):
        try:
            return datetime(*date_input)
        except Exception as e:
            raise ValueError(f"Invalid date list: {date_input} -> {e}")
    elif isinstance(date_input, str):
        try:
            return datetime.strptime(date_input, "%Y-%m-%d")
        except Exception as e:
            raise ValueError(f"Invalid date string: {date_input} -> {e}")
    else:
        raise ValueError(f"Unsupported date format: {date_input}")

def transform_backend_data(expenses):
    try:
        weekly_data = defaultdict(lambda: defaultdict(int))

        for expense in expenses:
            try:
                date_obj = parse_date_safe(expense["date"])
            except Exception as e:
                print(f"Data processing error: {e}")
                continue

            # Calculate week label like "Jan week 1"
            month = date_obj.strftime("%b")
            week_number = (date_obj.day - 1) // 7 + 1
            week_label = f"{month} week {week_number}"

            # Format category to lowercase with underscores
            category = expense["category"].lower().replace(" ", "_").replace("(", "").replace(")", "").replace("&", "and")

            # Create key like "food_groceries_day_1"
            day_of_week = date_obj.weekday() + 1  # Monday=0, Sunday=6 → +1 to match day_1...day_7
            key = f"{category}_day_{day_of_week}"

            # Sum amounts
            weekly_data[week_label][key] += expense["amount"]

        # Convert to list of dicts
        output = []
        for week, data in weekly_data.items():
            entry = {"week": week}
            entry.update(data)
            output.append(entry)

        return output

    except Exception as e:
        print(f"Data processing error: {e}")
        return []
    
@app.route('/predict', methods=['POST'])
def predict():
    # Authentication handling
    

    # Get and process data
    raw_data = request.get_json()
    if not raw_data:
        return jsonify({"error": "No data received"}), 400

    try:
        # Step 1: Simplify complex nested data
        cleaned_data = simplify_expenses(raw_data)

        # Step 2: Transform backend-style data to spreadsheet format
        weekly_format_data = transform_backend_data(cleaned_data)

        # Step 3: Convert to time series DataFrame
        df = parse_weekly_data(weekly_format_data)

        if df.empty:
            return jsonify({"error": "No valid data found"}), 400

    except Exception as e:
        logger.error(f"Data processing error: {e}")
        return jsonify({"error": "Data processing failed"}), 400

    # Step 4: Time series aggregation and forecasting
    df = df.set_index('date')

    weekly_df = (
        df
        .groupby('category', observed=True)
        .resample('W-MON')
        .agg({'amount': 'sum'})
        .reset_index()
    )

    pivot_df = (
        weekly_df
        .pivot_table(index='date', columns='category', values='amount', aggfunc='sum')
        .asfreq('W-MON')
        .fillna(0)
    )

    predictions = {}
    for category in pivot_df.columns:
        ts = pivot_df[category]
        nonzero_entries = ts[ts > 0]
        
        if len(nonzero_entries) < 2:  # More sensitive threshold
            # Calculate typical spending pattern
            day_pattern = ts.groupby(ts.index.dayofweek).mean()
            
            # Create 30-day forecast spreading average across typical days
            forecast = []
            avg = ts.mean()
            for i in range(30):
                # Get day of week for forecast day (0=Monday)
                forecast_day = (pd.Timestamp.now().dayofweek + i) % 7
                forecast.append(round(float(day_pattern.get(forecast_day, avg/7)), 2))
            
            predictions[category] = forecast
            
        else:
            try:
                # Improved model with weekly seasonality
                model = ExponentialSmoothing(
                    ts,
                    trend='add',
                    seasonal='add',
                    seasonal_periods=7,
                    damped_trend=True
                ).fit()
                
                forecast = model.forecast(30)
                predictions[category] = np.maximum(forecast, 0).round(2).tolist()
                
            except Exception as e:
                # Fallback to weekly pattern
                day_pattern = ts.groupby(ts.index.dayofweek).mean()
                forecast = [
                    round(float(day_pattern.get(i % 7, 0)), 2)
                    for i in range(30)
                ]
                predictions[category] = forecast

    return jsonify(predictions)




if __name__ == '__main__':
    app.run(debug=True, port=5000)