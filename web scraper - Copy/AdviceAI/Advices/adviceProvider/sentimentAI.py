import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib
# Load your dataset
df = pd.read_csv('SENTIMEMT3.csv')

# Preprocessing steps based on your data structure description

# 1. Clean column names (remove trailing spaces)
df.columns = df.columns.str.strip()

# 2. Aggregate daily expenses into weekly totals for each category
categories = ['housing', 'utilities', 'food_groceries', 'healthcare', 'transportation',
              'debt_repayment', 'insurance', 'childcare_family', 'education',
              'lifestyle_and_discretionary', 'entertainment', 'personal_expenses',
              'gifts_and_donations', 'Miscellaneous']

# Aggregate daily columns to weekly totals
for category in categories:
    # Get all columns for this category across all days
    day_columns = [col for col in df.columns if col.startswith(f"{category}_day_")]
    
    # Sum across all days for each week
    df[category] = df[day_columns].sum(axis=1)
    
    # Drop the individual day columns
    df.drop(columns=day_columns, inplace=True)

# 3. Handle sentiment labels (with typo correction)
sentiment_map = {
    'very negative': -2,
    'negative': -1,
    'Neutral': 0,
    'Positive': 1,
    'very positive': 2,
    'Very positive': 2,  # Handle case sensitivity
    'Very negative': -2,
    'Negetive': -1,  # Handle typo from your example
    'Very negetive': -2  # Handle typo
}

# Clean sentiment labels
df['sentiment_label'] = df['sentiment'].str.strip().str.lower()
df['sentiment_score'] = df['sentiment_label'].map({
    'very negative': -2,
    'negative': -1,
    'neutral': 0,
    'positive': 1,
    'very positive': 2
})

# 4. Feature engineering
df['essential_spending'] = df[['housing', 'utilities', 'food_groceries', 
                              'healthcare', 'transportation']].sum(axis=1)
df['discretionary_spending'] = df[['lifestyle_and_discretionary', 'entertainment',
                                  'gifts_and_donations']].sum(axis=1)
df['debt_ratio'] = df['debt_repayment'] / (df['essential_spending'] + df['discretionary_spending'] + 1e-6)

# 5. Prepare final dataset
features = categories + ['essential_spending', 'discretionary_spending', 'debt_ratio']
X = df[features]
y = df['sentiment_score']
X = X[~y.isna()]
y = y[~y.isna()]
# 6. Handle missing values (if any)
X = X.fillna(0)

# 7. Split and scale data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 8. Train model
model = RandomForestRegressor(n_estimators=400, random_state=42, max_depth=8)
model.fit(X_train_scaled, y_train)

# 9. Evaluate
y_pred = model.predict(X_test_scaled)
print(f"MSE: {mean_squared_error(y_test, y_pred):.2f}")
print(f"R² Score: {r2_score(y_test, y_pred):.2f}")
# Create a DataFrame with original test data
X_test_df = pd.DataFrame(X_test, columns=features)

# Add actual and predicted values
X_test_df['actual_sentiment'] = y_test.values
X_test_df['predicted_sentiment'] = y_pred

# Optionally round predictions if needed
X_test_df['predicted_sentiment'] = X_test_df['predicted_sentiment'].round(2)

# Display the results
print(X_test_df.head(10))  # Show first 10 rows

# 10. Feature importance
importance = pd.Series(model.feature_importances_, index=features)
print("\nTop 10 Important Features:")
print(importance.sort_values(ascending=False).head(10))


print("\nAll Predicted Sentiments:")
print(X_test_df['predicted_sentiment'].to_list())  # or just print(y_pred)

# Save model
# joblib.dump(model, 'sentiment_model2.pkl')

# # Save scaler (since it's needed for transforming future inputs)
# joblib.dump(scaler, 'scaler_sentiment2.pkl')