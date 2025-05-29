import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error
import xgboost as xgb

# Load your CSV
df = pd.read_csv("alien balla.csv")

# Clean and convert numerical columns if necessary
def to_numeric(col):
    return pd.to_numeric(col.astype(str).str.replace(',', ''), errors='coerce')

df['personal_income'] = to_numeric(df['What is your personal income?'])
df['household_income'] = to_numeric(df['What is your total household income?'])
df['household_members'] = to_numeric(df['How many people are in your house?'])
df['discretionary_spending'] = to_numeric(df['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'])
df['basic_needs_spending'] = to_numeric(df['If you live with family How much do you spend on basic needs monthly?'])
df['current_savings'] = to_numeric(df['How much do you save monthly?'])
df['Age'] = to_numeric(df['Age'])

# Calculate additional features
df['savings_ratio'] = df['current_savings'] / df['household_income']
df['discretionary_ratio'] = df['discretionary_spending'] / df['household_income']
df['income_per_member'] = df['household_income'] / df['household_members']

# RULE-BASED IDEAL SAVING FORMULA
def calculate_ideal_saving(row):
    base_saving = row['personal_income'] * 0.20
    penalty = 0
    if row['discretionary_ratio'] > 0.3:
        penalty = (row['discretionary_ratio'] - 0.3) * row['household_income']
    ideal = base_saving - penalty
    return max(ideal, 0)

df['ideal_saving'] = df.apply(calculate_ideal_saving, axis=1)

# Prepare features and labels
features = ['Age', 'personal_income', 'household_income', 'household_members',
            'discretionary_spending', 'basic_needs_spending', 'current_savings',
            'savings_ratio', 'discretionary_ratio', 'income_per_member',
            'Are you employed?', 'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?', 
            'What is your job?', 'What categories of income do you currently have?', 
            'financial_priority' if 'financial_priority' in df.columns else 'What is your job?']

df = df.dropna(subset=features + ['ideal_saving'])

X = df[features]
y = df['ideal_saving']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define columns
numeric_features = ['Age', 'personal_income', 'household_income', 'household_members',
                    'discretionary_spending', 'basic_needs_spending', 'current_savings',
                    'savings_ratio', 'discretionary_ratio', 'income_per_member']

categorical_features = ['Are you employed?', 'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?',
                        'What is your job?', 'What categories of income do you currently have?']

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Model pipeline
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=1000,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        early_stopping_rounds=50,
        random_state=42
    ))
])

# Fit
model.fit(X_train, y_train,
          regressor__eval_set=[(preprocessor.transform(X_test), y_test)],
          regressor__verbose=False)

# Evaluate
preds = model.predict(X_test)
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, preds))}")
print(f"MAE: {mean_absolute_error(y_test, preds)}")

# Predict on a sample
sample = X_test.iloc[[0]]
print(f"\nSuggested Savings: {model.predict(sample)[0]:.2f}")
print(f"True Ideal Saving (rule-based): {y_test.iloc[0]:.2f}")
