import pandas as pd
import numpy as np
from scipy.special import erf


def load_and_clean_data():
    df = pd.read_csv('LATEST GEMBA.csv')
    
    # Handle missing values
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].fillna('')
    for col in df.select_dtypes(include=['float64', 'int64']).columns:
        df[col] = df[col].fillna(0)
    
    return df

def calculate_financial_targets(df):
    """Calculate complex financial target columns"""

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
    


    # Wealth Momentum Index (WMI)

    
    # Financial Resilience Factor (FRF)
    household_income = df['What is your total household income?']
    basic_needs = df['basic_needs']
    personal_income = df['What is your personal income?']
    savings = df['How much do you save monthly?']
    household_size = df['How many people are in your house?']
    normalized_savings = savings / (personal_income + 1e-6)
    exponent_term = normalized_savings / (household_size + 1)

    df['WMI'] = (np.log1p(personal_income) * 
                np.expm1(exponent_term) *  # Safer than exp()
                (1 + erf(df['Age']/40)) / 
                (np.sqrt(df['unwanted_spending']) + 1))
    
    df['FRF'] = (np.tanh((household_income - basic_needs)/(personal_income + 1e-6)) * 
                (1 - np.exp(-savings/(10*df['unwanted_spending'] + 1))) + 
                np.arctan(df['Age']/25)/np.pi)
    
    # Discretionary Spending Efficiency (DSE)
    df['DSE'] = (np.log1p(personal_income * savings) * 
                (1 + np.sin(df['Age'] * np.pi/50)) * 
                np.exp(-df['How many people are in your house?']/5) / 
                (df['unwanted_spending']**1.5 + basic_needs + 1e-6))
    
    # Compound Financial Health Score (CFH)
    household_income = df['What is your total household income?']
    df['CFH'] = ((savings**2 * (1 - np.exp(-df['Age']/30))) / 
                (np.sqrt(df['unwanted_spending'] * basic_needs) + 1) * 
                (np.arctan(personal_income/100000) * 2/np.pi) * 
                (1 + np.tanh((household_income - personal_income)/500000)))
    
    return df

# Load and preprocess data
df = load_and_clean_data()  # Your existing function
# df, label_encoder = preprocess_data(df)  # Your existing function

# Add the complex targets
df = calculate_financial_targets(df)

# Remove raw features to prevent leakage
# excluded_features = [
#     'What is your personal income?',
#     'How much do you save monthly?',
#     'unwanted_spending',
#     'basic_needs',
#     'What is your total household income?',
#     'Age',
#     'How many people are in your house?',
#     'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
#     'If you live alone, How much do you spend on basic needs monthly?',
#     'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
#     'If you live with family How much do you spend on basic needs monthly?',
#     'How much do you want to save monthly ( could be different from what you actually save)'
# ]

# Keep only final features and targets
# keep_columns = [col for col in df.columns if col not in excluded_features]
# df_final = df[keep_columns]

# Export to CSV
df.to_csv('enhanced_financial_ds2.csv', index=False)

print("Dataset with targets saved to enhanced_financial_dataset.csv")
print("Final columns:", df.columns.tolist())