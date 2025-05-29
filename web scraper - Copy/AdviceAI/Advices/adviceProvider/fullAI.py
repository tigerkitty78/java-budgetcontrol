import pandas as pd
import numpy as np

import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
from scipy.special import erf

# Data Loading and Cleaning
def load_and_clean_data():
    df = pd.read_csv('enhanced_financial_ds2.csv')
    
    # Handle missing values
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].fillna('')
    for col in df.select_dtypes(include=['float64', 'int64']).columns:
        df[col] = df[col].fillna(0)
    
    return df

# Main Preprocessing Function
def preprocess_data(df):
    # Binary encoding
    binary_map = {'Yes': 1, 'No': 0}
    binary_cols = ['Are you employed?', 'Do you have a vehicle/s?', 
                   'Do you live alone and cover your own expenses?']
    for col in binary_cols:
        df[col] = df[col].map(binary_map).fillna(0).astype(int)

    # Numeric conversion (handling commas and spaces)
    numeric_cols = [
        'What is your personal income?', 'What is your total household income?',
        'How much do you save monthly?', 'How many people are in your house?',
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend on basic needs monthly?',
        'How much do you want to save monthly ( could be different from what you actually save)',
        'Age'
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(
            df[col].astype(str).str.replace(',', '').str.replace(' ', '').str.strip(),
            errors='coerce'
        ).fillna(0)

    # Derived features
    df['unwanted_spending'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 1,
        df['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'],
        df['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']
    )
    df['basic_needs'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 1,
        df['If you live alone, How much do you spend on basic needs monthly?'],
        df['If you live with family How much do you spend on basic needs monthly?']
    )
    
    # Drop original columns
    df.drop(columns=[
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend on basic needs monthly?'
    ], inplace=True, errors='ignore')

    # Handle divisions
    # df['savings_ratio'] = df['How much do you save monthly?'] / df['What is your personal income?'].replace(0, 1)
    df['wants_needs_ratio'] = df['unwanted_spending'] / df['basic_needs'].replace(0, 1)
    
    # Wealth calculations
    df['household_income_per_capita'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 0,
        df['What is your total household income?'] / df['How many people are in your house?'].replace(0, 1),
        df['What is your personal income?']
    )
    df['wealth_indicator'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 0,
        0.7 * df['household_income_per_capita'] + 0.3 * df['What is your personal income?'],
        df['What is your personal income?']
    )

    # Investment allocations
    df['equity_allocation'] = np.clip(110 - df['Age'], 20, 90)
    df['fixed_income_allocation'] = 100 - df['equity_allocation']
    
    # Process Investment Type (take first category)
    df['Investment type'] = df['Investment type'].str.split(',').str[0].str.strip()
    
    # Generate optimal savings if missing
    # if 'optimal_savings' not in df.columns:
    #     df['optimal_savings'] = np.where(
    #         df['How much do you want to save monthly ( could be different from what you actually save)'] > 0,
    #         df['How much do you want to save monthly ( could be different from what you actually save)'],
    #         df['What is your personal income?'] * 0.2  # Default to 20% of income
    #     )
    
    # Convert Risk_proxy_returns to numeric
    df['Risk_proxy_returns'] = pd.to_numeric(
        df['Risk_proxy_returns'].astype(str).str.replace(',', '').str.replace(' ', ''),
        errors='coerce'
    ).fillna(0)
    
    # Encode investment types
    le = LabelEncoder()
    df['Investment_Type_Encoded'] = le.fit_transform(df['Investment type'])
    
    # Final cleaning
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)
    

        # Remove all target-related derivations
    df = df.drop([ 'Investment_Type_Encoded','Savings_Ratio','How much do you want to save monthly ( could be different from what you actually save)'], axis=1, errors='ignore')
    
    # Add proper investment type encoding LATER
    # Remove equity_allocation derivation
    # df = df.drop(['equity_allocation', 'fixed_income_allocation'], axis=1, errors='ignore')
    return df, le

def calculate_ideal_savings(df):
    return (
        np.log1p(df['What is your personal income?']) *
        (1 - np.exp(-df['Age']/30)) *
        (1 + erf((df['How much do you save monthly?'] - df[ 'unwanted_spending'])/
                   (df['basic_needs'] + 1))) *
        (1 + np.tanh(df['How many people are in your house?']/4)) *
        (np.cos(df['Age'] * np.pi/50) + 1.5)
    )


# Load and preprocess data
df = load_and_clean_data()
# Add to preprocessing

df, label_encoder = preprocess_data(df)
df['ideal_savings'] = calculate_ideal_savings(df)
print("Columns in DataFrame before training:", df.columns.tolist())

# Feature and target setup
features = [
    'Are you employed?', 'What is your job?', 'What categories of income do you currently have?',
    'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?',
    'What is your personal income?', 'What is your total household income?',
    'How many people are in your house?', 'Age', 'wants_needs_ratio', 'wealth_indicator',
    'equity_allocation', 'fixed_income_allocation'
]


X = df[features]

# Remove 'savings_ratio' from features for savings model
features = [f for f in features if f != 'savings_ratio']
categorical_features = ['What is your job?', 'What categories of income do you currently have?']
numeric_features = list(set(features) - set(categorical_features))

targets = {
    'savings': 'How much do you save monthly?',  # Raw savings amount
    'investment': 'Investment type',  # Raw labels
    'risk_return': 'Risk_proxy_returns',
    'ideal_savings':'ideal_savings'
}


# Preprocessing pipeline
preprocessor = ColumnTransformer(transformers=[
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
    ('num', StandardScaler(), numeric_features)
   
])
# PREPROCESSING FIX

# Add these new targets
targets = {
    'savings': 'How much do you save monthly?',
    'investment': 'Investment type',
    'risk_return': 'Risk_proxy_returns',
    'ideal_savings': 'ideal_savings',
    'wmi': 'WMI',
    'frf': 'FRF',
    'dse': 'DSE',
    'cfh': 'CFH'
}

# Preprocessing pipeline (already defined as preprocessor)

# Data splitting
X_train, X_test, y_train, y_test = train_test_split(X, df[targets.values()], test_size=0.2, random_state=42)

# Splitting for all targets
y_train_s = y_train[targets['savings']]
y_test_s = y_test[targets['savings']]

y_train_i = y_train[targets['investment']]
y_test_i = y_test[targets['investment']]

y_train_r = y_train[targets['risk_return']]
y_test_r = y_test[targets['risk_return']]

y_train_ss = y_train[targets['ideal_savings']]
y_test_ss = y_test[targets['ideal_savings']]

y_train_wmi = y_train[targets['wmi']]
y_test_wmi = y_test[targets['wmi']]

y_train_frf = y_train[targets['frf']]
y_test_frf = y_test[targets['frf']]

y_train_dse = y_train[targets['dse']]
y_test_dse = y_test[targets['dse']]

y_train_cfh = y_train[targets['cfh']]
y_test_cfh = y_test[targets['cfh']]

# Encode investment type
investment_encoder = LabelEncoder()
y_train_i_encoded = investment_encoder.fit_transform(y_train_i)
y_test_i_encoded = investment_encoder.transform(y_test_i)

# Model pipelines
savings_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# investment_model = Pipeline([
#     ('preprocessor', preprocessor),
#     ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
# ])

risk_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

ideal_savings_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(
        n_estimators=150,
        max_depth=7,
        min_samples_leaf=20,
        random_state=42
    ))
])

# New models for WMI, FRF, DSE, CFH (all regression models)
wmi_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

frf_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

dse_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

cfh_model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Training
print("Training Savings Model...")
savings_model.fit(X_train, y_train_s)

# print("\nTraining Investment Model...")
# investment_model.fit(X_train, y_train_i_encoded)

print("\nTraining Risk/Return Model...")
risk_model.fit(X_train, y_train_r)

print("\nTraining Ideal Savings Model...")
ideal_savings_model.fit(X_train, y_train_ss)

print("\nTraining WMI Model...")
wmi_model.fit(X_train, y_train_wmi)

print("\nTraining FRF Model...")
frf_model.fit(X_train, y_train_frf)

print("\nTraining DSE Model...")
dse_model.fit(X_train, y_train_dse)

print("\nTraining CFH Model...")
cfh_model.fit(X_train, y_train_cfh)

# Evaluation function
# Updated Prediction Function
#  Evaluation
def evaluate_model(model, X_test, y_test, model_type='regression'):
    y_pred = model.predict(X_test)

    # Print only the first 20 actual vs predicted values
    print("Actual vs Predicted (First 20 rows):")
    for idx, (actual, predicted) in enumerate(zip(y_test, y_pred)):
        if idx >= 20:
            break
        print(f"{idx+1}. Actual: {actual}, Predicted: {predicted}")
    if model_type == 'regression':
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        print(f"RMSE: {rmse:.2f}, R²: {r2:.2f}")
        return rmse, r2
    else:
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Accuracy: {accuracy:.2f}")
        print("Classification Report:")
        print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
        return accuracy

print("\nSavings Model Evaluation:")
evaluate_model(savings_model, X_test, y_test_s)

# print("\nInvestment Model Evaluation:")
# evaluate_model(investment_model, X_test, y_test_i, 'classification')

print("\nRisk/Return Model Evaluation:")
evaluate_model(risk_model, X_test, y_test_r)

print("\n complex Savings Model Evaluation:")
evaluate_model(ideal_savings_model, X_test, y_test_ss)

print("\n wmi Model Evaluation:")
evaluate_model(wmi_model, X_test, y_test_wmi)
print("\n frf Model Evaluation:")
evaluate_model(frf_model, X_test, y_test_frf)
print("\n dse Model Evaluation:")
evaluate_model(dse_model, X_test, y_test_dse)
print("\n cfh Model Evaluation:")
evaluate_model(cfh_model, X_test, y_test_cfh)

# Prediction function
def financial_advisor_predict(sample_data):
    try:
        savings_pred = savings_model.predict(sample_data)
        # investment_pred = investment_model.predict(sample_data)
        risk_pred = risk_model.predict(sample_data)
        compsaving_pred = ideal_savings_model.predict(sample_data)
        wmi_pred = wmi_model.predict(sample_data)
        frf_pred = frf_model.predict(sample_data)
        dse_pred = dse_model.predict(sample_data)
        cfh_pred = cfh_model.predict(sample_data)
        return {
            'recommended_savings': float(savings_pred[0]),
            # 'investment_recommendation': label_encoder.inverse_transform(investment_pred)[0],
            'estimated_risk_return': float(risk_pred[0]),
            'compsaving_pred' : float(compsaving_pred[0]),
            'wmi_pred' : float( wmi_pred[0]),
            'frf_pred' : float(frf_pred[0]),
            'dse_pred' : float(dse_pred[0]),
            '_pred' : float(cfh_pred[0])
        } 

    
    except Exception as e:
        return {'error': str(e)}


# Example usage
sample_input = pd.DataFrame([{
    'Age': 32,
    'What is your personal income?': 450000,
    'savings_ratio': 0.25,
    'wealth_indicator': 380000,
    'equity_allocation': 78,
    'Do you live alone and cover your own expenses?': 1,
    'What is your job?': 'Software Engineer',
    'What categories of income do you currently have?': 'Salary',
    'How many people are in your house?': 1,
    'How much do you save monthly?': 150000
}])

# Print predictions nicely
print("\n--- Sample Financial Advice ---")
predictions = financial_advisor_predict(sample_input)

for key, value in predictions.items():
    print(f"{key}: {value}")
