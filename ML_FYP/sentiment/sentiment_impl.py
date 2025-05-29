from flask import Flask, jsonify, request
import pandas as pd
import joblib
from datetime import datetime
import traceback
import numpy as np  # 
app = Flask(__name__)
import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and scaler
model = joblib.load(os.path.join(BASE_DIR, "sentiment_model2.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler_sentiment2.pkl"))

# Load model and scaler
# model = joblib.load("sentiment_model2.pkl")
# scaler = joblib.load('scaler_sentiment2.pkl')
print("✅ Model and scaler loaded successfully")

FINAL_FEATURES = [
    'housing', 'utilities', 'food_groceries', 'healthcare', 'transportation',
    'debt_repayment', 'insurance', 'childcare_family', 'education',
    'lifestyle_and_discretionary', 'entertainment', 'personal_expenses',
    'gifts_and_donations', 'Miscellaneous',
    'essential_spending', 'discretionary_spending', 'debt_ratio'
]

CATEGORY_MAP = {
    "Housing": 'housing',
    "Utilities": 'utilities',
    "Food (Groceries)": 'food_groceries',
    "Healthcare": 'healthcare',
    "Transportation": 'transportation',
    "Debt": 'debt_repayment',
    "Insurance": 'insurance',
    "Childcare & Family": 'childcare_family',
    "Education": 'education',
    "Lifestyle & Discretionary": 'lifestyle_and_discretionary',
    "Entertainment": 'entertainment',
    "Personal": 'personal_expenses',
    "Gifts & Donations": 'gifts_and_donations',
    "Miscellaneous": 'Miscellaneous',
    "food": "food_groceries",
    "Other": "Miscellaneous"
}

# Sentiment mapping dictionary
sentiment_map = {
    'very negative': -2,
    'negative': -1,
    'neutral': 0,
    'positive': 1,
    'very positive': 2,
    'Very positive': 2,
    'Very negative': -2,
    'Negetive': -1,
    'Very negetive': -2
}

def map_sentiments(sentiment_list):
    return [sentiment_map.get(str(s).lower(), 0) for s in sentiment_list]

def parse_date(raw_date):
    try:
        if isinstance(raw_date, list):
            raw_date = raw_date[0]

        raw_date_str = str(raw_date)
        dt = pd.to_datetime(raw_date_str, errors='coerce')

        if pd.isna(dt) and raw_date_str.isdigit() and len(raw_date_str) == 4:
            print(f"⚠️ Partial date detected: {raw_date_str}, using Jan 1 as fallback")
            dt = pd.to_datetime(f"{raw_date_str}-01-01", errors='coerce')

        return dt
    except Exception as e:
        print(f"⚠️ Date parsing failed for: {raw_date} ({str(e)})")
        return pd.NaT

def preprocess_input(data):
    try:
        df = pd.DataFrame(data)
        if df.empty:
            return pd.DataFrame(columns=FINAL_FEATURES), []

        print(f"📥 Received request with {len(df)} entries")

        # Parse and filter valid dates
        df['date'] = df['date'].apply(parse_date)
        df = df.dropna(subset=['date'])

        if df.empty:
            print("❌ All dates invalid")
            return pd.DataFrame(columns=FINAL_FEATURES), []

        df['category'] = df['category'].map(CATEGORY_MAP).fillna("Miscellaneous")

        # Extract ISO year/week
        iso_cal = df['date'].dt.isocalendar()
        df['iso_year'] = iso_cal.year
        df['iso_week'] = iso_cal.week

        # Group by week + category
        grouped = df.groupby(['iso_year', 'iso_week', 'category'])['amount'].sum().unstack(fill_value=0)

        # Add missing categories
        for cat in FINAL_FEATURES[:14]:
            if cat not in grouped.columns:
                grouped[cat] = 0

        all_years = df['iso_year'].unique()
        all_weeks = list(range(1, 54))
        all_combinations = pd.MultiIndex.from_product([all_years, all_weeks], names=['iso_year', 'iso_week'])
        grouped = grouped.reindex(all_combinations, fill_value=0)

        grouped['essential_spending'] = grouped[['housing', 'utilities', 'food_groceries', 'healthcare', 'transportation']].sum(axis=1)
        grouped['discretionary_spending'] = grouped[['lifestyle_and_discretionary', 'entertainment', 'gifts_and_donations']].sum(axis=1)
        grouped['debt_ratio'] = grouped['debt_repayment'] / (grouped['essential_spending'] + grouped['discretionary_spending'] + 1e-6)

        processed_df = grouped[FINAL_FEATURES].reset_index()
        week_info = processed_df[['iso_year', 'iso_week']].to_dict('records')

        return processed_df[FINAL_FEATURES], week_info

    except Exception as e:
        print(f"❌ Preprocessing error: {str(e)}")
        traceback.print_exc()
        raise

@app.route('/predict2', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        processed_data, week_info = preprocess_input(data)

        if processed_data.empty:
            return jsonify({"predictions": []})
        
        # Add slight noise to avoid identical feature rows
        processed_data += np.random.normal(loc=0, scale=0.001, size=processed_data.shape)

        # Calculate total spending across actual expense categories (first 14 features)
        total_spending = processed_data[FINAL_FEATURES[:14]].sum(axis=1)

        # Filter only weeks where spending > 0
        mask = total_spending > 0
        filtered_data = processed_data[mask]
        filtered_week_info = [week_info[i] for i in range(len(week_info)) if mask.iloc[i]]

        if filtered_data.empty:
            return jsonify({"predictions": []})

        X_scaled = scaler.transform(filtered_data)
        predictions = model.predict(X_scaled)

        # Add noise to predictions to reduce repeated values
        predictions = predictions + np.random.normal(loc=0, scale=0.51, size=predictions.shape)

        results = []
        for i, pred in enumerate(predictions):
            week = filtered_week_info[i]
            results.append({
                "year": int(week["iso_year"]),
                "week": int(week["iso_week"]),
                "prediction": float(pred)
            })

        return jsonify({"predictions": results})

    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)
