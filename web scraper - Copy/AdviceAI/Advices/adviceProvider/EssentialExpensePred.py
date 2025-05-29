import pandas as pd
import numpy as np

from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

# Load and clean data
def load_and_clean_data():
    df = pd.read_csv('enhanced_financial_ds2.csv')
    
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].fillna('')
    for col in df.select_dtypes(include=['float64', 'int64']).columns:
        df[col] = df[col].fillna(0)
    
    return df

# Preprocessing
def preprocess_data(df):
    binary_map = {'Yes': 1, 'No': 0}
    binary_cols = ['Are you employed?', 'Do you have a vehicle/s?', 
                   'Do you live alone and cover your own expenses?']
    for col in binary_cols:
        df[col] = df[col].map(binary_map).fillna(0).astype(int)

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

    # Combine needs and wants
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

    df.drop(columns=[
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend on basic needs monthly?'
    ], inplace=True, errors='ignore')

    df['wants_needs_ratio'] = df['unwanted_spending'] / df['basic_needs'].replace(0, 1)
    
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

    df['equity_allocation'] = np.clip(110 - df['Age'], 20, 90)
    df['fixed_income_allocation'] = 100 - df['equity_allocation']

    df['Investment type'] = df['Investment type'].str.split(',').str[0].str.strip()

    df['Risk_proxy_returns'] = pd.to_numeric(
        df['Risk_proxy_returns'].astype(str).str.replace(',', '').str.replace(' ', ''),
        errors='coerce'
    ).fillna(0)

    le = LabelEncoder()
    df['Investment_Type_Encoded'] = le.fit_transform(df['Investment type'])

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)

    df = df.drop(['Investment_Type_Encoded', 'How much do you want to save monthly ( could be different from what you actually save)'], axis=1, errors='ignore')
    return df

# Load and preprocess
df = load_and_clean_data()
df = preprocess_data(df)

# Target and features
target = 'basic_needs'
features = [
    'Are you employed?', 'What is your job?', 'What categories of income do you currently have?',
    'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?',
    'What is your personal income?', 'What is your total household income?',
    'How many people are in your house?', 'Age', 'wants_needs_ratio', 'wealth_indicator',
    'equity_allocation', 'fixed_income_allocation'
]

X = df[features]
y = df[target]

categorical_features = ['What is your job?', 'What categories of income do you currently have?']
numeric_features = list(set(features) - set(categorical_features))

# Preprocessing pipeline
preprocessor = ColumnTransformer(transformers=[
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
    ('num', StandardScaler(), numeric_features)
])

# Model pipeline
model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train and evaluate
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("R² score:", r2_score(y_test, y_pred))
print("MSE:", mean_squared_error(y_test, y_pred))
