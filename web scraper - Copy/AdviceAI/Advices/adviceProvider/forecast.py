import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import xgboost as xgb
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
import joblib
# --- Function to convert Month_Week to a proper datetime ---
# --- Assign default year (can be changed later) ---
DEFAULT_YEAR = 2023

# --- Function to convert Month_Week to a proper datetime ---
def convert_to_date(mw, year=DEFAULT_YEAR):
    try:
        month, _, week = mw.split()
        base = pd.to_datetime(f"{month} 1 {year}")
        return base + pd.DateOffset(weeks=int(week) - 1)
    except:
        return pd.NaT
# --- Load and preprocess the dataset ---
df = pd.read_csv("SENTIMEMT3.csv")
df = df.rename(columns={df.columns[0]: 'Month_Week'})


df = df.dropna(how='all', axis=1)  # Remove any fully empty columns

# Melt into long format and extract Category/Day
df_melted = pd.melt(df, id_vars=["Month_Week"], var_name="Category_Day", value_name="Amount")

split = df_melted["Category_Day"].str.rsplit("_day_", n=1, expand=True)
df_melted["Category"] = split[0]
df_melted["Day"] = pd.to_numeric(split[1], errors='coerce').fillna(0).astype(int)

# Convert to actual dates
df_melted["Week_Start"] = df_melted["Month_Week"].apply(convert_to_date)
df_melted["Date"] = df_melted.apply(
    lambda row: row["Week_Start"] + pd.DateOffset(days=row["Day"]-1)
    if row["Day"] > 0 else row["Week_Start"], axis=1)

# Final cleaning
df_clean = df_melted[["Date", "Category", "Amount"]].dropna()

# Exclude categories starting with 'Unnamed' and 'Miscellaneous'
mask = df_clean['Category'].str.contains('^Unnamed', na=False) | (df_clean['Category'] == 'Miscellaneous')
df_clean = df_clean[~mask]
# Drop unwanted categories
df_clean = df_clean[~df_clean["Category"].isin(["Unnamed:106", "Unnamed:107", "Miscellaneous","debt_repayment"])]

# df_clean = df_clean[["Unnamed:106","Unnamed:107","Miscellaneous"]].drop
df_clean["Amount"] = pd.to_numeric(df_clean["Amount"], errors="coerce").fillna(0)

# --- Forecasting ---
MIN_DATA_DAYS = 7
category_models = {}
forecast_results = []
categories = df_clean['Category'].unique()

for category in categories:
    df_cat = df_clean[df_clean['Category'] == category].copy()
    
    # Aggregate and fill missing dates
    df_cat = df_cat.groupby("Date", as_index=False)["Amount"].sum()
    full_dates = pd.date_range(df_cat['Date'].min(), df_cat['Date'].max())
    df_cat = df_cat.set_index("Date").reindex(full_dates).fillna(0).rename_axis("Date").reset_index()
    df_cat["Category"] = category
    
    daily_totals = df_cat.groupby("Date", as_index=False)["Amount"].sum()
    
    if len(daily_totals) < MIN_DATA_DAYS:
        if len(daily_totals) > 0:
            print(f"⚠️ Using simple avg for {category} ({len(daily_totals)} days)")
            avg = daily_totals["Amount"].mean()
            last_date = daily_totals["Date"].iloc[-1]
            forecast_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=30)
            for date in forecast_dates:
                forecast_results.append({
                    "Date": date,
                    "Category": category,
                    "Predicted_Amount": avg
                })
        else:
            print(f"❌ Skipping {category} (no data)")
        continue
    
    # --- Feature Engineering ---
    daily_totals["Day"] = daily_totals["Date"].dt.dayofyear
    daily_totals["Day_sin"] = np.sin(2 * np.pi * daily_totals["Day"] / 365)
    daily_totals["Day_cos"] = np.cos(2 * np.pi * daily_totals["Day"] / 365)
    daily_totals["Prev_Amount"] = daily_totals["Amount"].shift(1).fillna(0)
    daily_totals["Rolling_7"] = daily_totals["Amount"].rolling(7).mean().shift(1).fillna(0)
    daily_totals["Rolling_30"] = daily_totals["Amount"].rolling(30).mean().shift(1).fillna(0)
    
    # --- Train/Test Split ---
    X = daily_totals[['Prev_Amount', 'Rolling_7', 'Rolling_30', 'Day_sin', 'Day_cos']]
    y = daily_totals['Amount']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=30, shuffle=False)
    
    model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X_train, y_train)
    category_models[category] = model
    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"✅ {category} - MAE (last 30 days): LKR {mae:,.2f}")
    
    # --- Forecast Next 30 Days ---
    last_amount = daily_totals.iloc[-1]['Amount']
    rolling_7_window = list(daily_totals['Amount'].iloc[-7:])
    rolling_30_window = list(daily_totals['Amount'].iloc[-30:])
    start_date = daily_totals.iloc[-1]['Date']
    forecast_dates = pd.date_range(start=start_date + pd.Timedelta(days=1), periods=30)
    
    for date in forecast_dates:
        rolling_7 = np.mean(rolling_7_window)
        rolling_30 = np.mean(rolling_30_window)
        
        features = pd.DataFrame({
            'Prev_Amount': [last_amount],
            'Rolling_7': [rolling_7],
            'Rolling_30': [rolling_30],
            'Day_sin': [np.sin(2 * np.pi * date.dayofyear / 365)],
            'Day_cos': [np.cos(2 * np.pi * date.dayofyear / 365)]
        })
        
        pred = model.predict(features)[0]
        rolling_7_window.pop(0)
        rolling_7_window.append(pred)
        rolling_30_window.pop(0)
        rolling_30_window.append(pred)
        
        forecast_results.append({
            'Date': date,
            'Category': category,
            'Predicted_Amount': pred
        })
        
        last_amount = pred

# --- Final Forecast DataFrame ---
forecast_df = pd.DataFrame(forecast_results)

# --- Plot Forecast ---
# --- Plot Forecast (only for next 30 days) ---
plt.figure(figsize=(14, 6))

# Filter only forecast dates (not historical)
forecast_only = forecast_df.copy()
forecast_only = forecast_only[forecast_only["Date"] >= forecast_only["Date"].min()]  # already forecast only

for category in forecast_only['Category'].unique():
    subset = forecast_only[forecast_only['Category'] == category]
    plt.plot(subset['Date'], subset['Predicted_Amount'], label=category)

plt.title("Per-Category Forecast for Next 30 Days")
plt.xlabel("Date")
plt.ylabel("Predicted Amount (LKR)")
plt.xticks(rotation=45)
plt.xlim(forecast_only["Date"].min(), forecast_only["Date"].max())  # limit x-axis
plt.legend(loc="upper left", bbox_to_anchor=(1.01, 1), borderaxespad=0.)
plt.tight_layout()
plt.show()

# --- Summary Statistics ---
summary = forecast_df.groupby("Category")["Predicted_Amount"].agg(['mean', 'std']).reset_index()
print("\n📈 Forecast Summary for Next 30 Days (per Category):")
for _, row in summary.iterrows():
    print(f"- {row['Category']}: LKR {row['mean']:.2f} ± LKR {row['std']:.2f}")
import joblib

# Save the entire dictionary of models
# joblib.dump(category_models, "category_models.pkl")
print("✅ Models saved to 'category_models.pkl'")

print("\n📅 Daily Forecast (Next 30 Days):")
daily_forecast = forecast_df.sort_values(by=["Date", "Category"])
for date, group in daily_forecast.groupby("Date"):
    print(f"\n🗓 {date.strftime('%Y-%m-%d')}")
    for _, row in group.iterrows():
        print(f"  - {row['Category']}: LKR {row['Predicted_Amount']:.2f}")
