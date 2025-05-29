import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.base import BaseEstimator, TransformerMixin

# 1. Data Loading and Cleaning
def load_and_clean_data():
    df = pd.read_csv('alien balla.csv')
    
    # Handle missing values
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].fillna('')
    for col in df.select_dtypes(include=['float64', 'int64']).columns:
        df[col] = df[col].fillna(0)
    
    return df

# 2. Advanced Feature Engineering
class FinancialTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.feature_names_ = None
        
    def fit(self, X, y=None):
        if isinstance(X, pd.DataFrame):
            self.feature_names_ = X.columns.tolist()
        return self
    
    def transform(self, X):
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X, columns=self.feature_names_)
            
        X['financial_stability'] = X['savings_ratio'] * (1 - X['wants_needs_ratio'])
        X['risk_capacity'] = (X['Age'] / 100) * X['wealth_indicator']
        X['investment_potential'] = X['wealth_indicator'] * X['equity_allocation'] / 100
        return X

    def get_feature_names_out(self, input_features=None):
        return self.feature_names_ + ['financial_stability', 'risk_capacity', 'investment_potential']

# 3. Dynamic Advice Generation
def generate_dynamic_advice(row):
    risk_profile = 0
    risk_profile += min(2, row['Age'] // 30)
    risk_profile += 1 if row['savings_ratio'] > 0.2 else 0
    risk_profile = min(risk_profile, 2)
    
    advice_matrix = {
        0: {'recommend': ["Govt Bonds", "Fixed Deposits", "Money Market"], 'avoid': ["Cryptocurrency", "High-Risk Stocks"]},
        1: {'recommend': ["Corporate Bonds", "REITs", "Blue-Chip Stocks"], 'avoid': ["Penny Stocks", "Margin Trading"]},
        2: {'recommend': ["Venture Capital", "Growth Stocks", "Private Equity"], 'avoid': ["Low-Yield Savings", "Over-Diversification"]}
    }
    
    income = row['What is your personal income?']
    if income > 1000000:
        advice_matrix[2]['recommend'].append("Hedge Funds")
    elif income > 500000:
        advice_matrix[1]['recommend'].append("Real Estate")
    
    if row['Are you employed?'] == 0:
        advice_matrix[0]['recommend'].append("Emergency Fund")
    
    return advice_matrix[risk_profile]

# 4. Enhanced Data Preprocessing
def preprocess_data(df):
    df.columns = df.columns.str.strip()
    
    binary_cols = ['Are you employed?', 'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?']
    for col in binary_cols:
        df[col] = df[col].astype(str).str.lower().str.strip()
        df[col] = np.where(df[col].isin(['yes', '1', 'true', 'y']), 1, 0)
    
    numeric_cols = [
        'How many people are in your house?', 'What is your personal income?',
        'What is your total household income?', 'How much do you save monthly?', 'Age'
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col].astype(str).str.replace('[^0-9.]', '', regex=True), errors='coerce').fillna(0)
    
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
    
    df['savings_ratio'] = df['How much do you save monthly?'] / df['What is your personal income?'].replace(0, 1)
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
    
    advice_data = df.apply(generate_dynamic_advice, axis=1)
    df['Recommended_1'] = advice_data.apply(lambda x: x['recommend'][0])
    df['Recommended_2'] = advice_data.apply(lambda x: x['recommend'][1] if len(x['recommend']) > 1 else '')
    df['Avoid'] = advice_data.apply(lambda x: x['avoid'][0])
    
    return df

# 5. Feature Definition
numeric_features = [
    'Are you employed?', 'How many people are in your house?',
    'What is your personal income?', 'What is your total household income?',
    'How much do you save monthly?', 'Age', 'savings_ratio',
    'wants_needs_ratio', 'wealth_indicator', 'equity_allocation',
    'fixed_income_allocation'
]

categorical_features = [
    'What is your job?', 'What categories of income do you currently have?'
]

features = numeric_features + categorical_features

# 6. Pipeline Setup
numeric_transformer = Pipeline([
    ('financial', FinancialTransformer()),
    ('scaler', StandardScaler())
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ],
    remainder='drop'
)

# 7. Model Definition and Training
class FinancialAdvisor:
    def __init__(self):
        self.models = {
            'Recommended_1': Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', RandomForestClassifier(n_estimators=200, class_weight='balanced'))
            ]),
            'Recommended_2': Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', RandomForestClassifier(n_estimators=200, class_weight='balanced'))
            ]),
            'Avoid': Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', RandomForestClassifier(n_estimators=200, class_weight='balanced'))
            ])
        }
        self.le_rec1 = LabelEncoder()
        self.le_rec2 = LabelEncoder()
        self.le_avoid = LabelEncoder()
    
    def train(self, df):
        df = preprocess_data(df)
        X = df[features]
        y = df[['Recommended_1', 'Recommended_2', 'Avoid']]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.le_rec1.fit(y_train['Recommended_1'])
        self.le_rec2.fit(y_train['Recommended_2'])
        self.le_avoid.fit(y_train['Avoid'])
        
        y_train_encoded = pd.DataFrame({
            'Recommended_1': self.le_rec1.transform(y_train['Recommended_1']),
            'Recommended_2': self.le_rec2.transform(y_train['Recommended_2']),
            'Avoid': self.le_avoid.transform(y_train['Avoid'])
        })
        
        for target in self.models:
            print(f"Training {target} model...")
            self.models[target].fit(X_train, y_train_encoded[target])
    
    def predict(self, input_data):
        try:
            missing = set(features) - set(input_data.columns)
            if missing:
                return {'error': f"Missing features: {missing}"}
            
            return {
                'Recommended_1': self.le_rec1.inverse_transform(self.models['Recommended_1'].predict(input_data))[0],
                'Recommended_2': self.le_rec2.inverse_transform(self.models['Recommended_2'].predict(input_data))[0],
                'Avoid': self.le_avoid.inverse_transform(self.models['Avoid'].predict(input_data))[0]
            }
        except Exception as e:
            return {'error': str(e)}

    def evaluate(self, df):
        df = preprocess_data(df)
        X = df[features]
        y = df[['Recommended_1', 'Recommended_2', 'Avoid']]
        
        preds = {
            'Recommended_1': self.le_rec1.inverse_transform(self.models['Recommended_1'].predict(X)),
            'Recommended_2': self.le_rec2.inverse_transform(self.models['Recommended_2'].predict(X)),
            'Avoid': self.le_avoid.inverse_transform(self.models['Avoid'].predict(X))
        }
        
        accuracies = {
            'Recommended_1': accuracy_score(y['Recommended_1'], preds['Recommended_1']),
            'Recommended_2': accuracy_score(y['Recommended_2'], preds['Recommended_2']),
            'Avoid': accuracy_score(y['Avoid'], preds['Avoid'])
        }
        
        joint_correct = np.all(pd.DataFrame(preds) == y, axis=1)
        joint_accuracy = joint_correct.mean()
        
        reports = {
            'Recommended_1': classification_report(y['Recommended_1'], preds['Recommended_1'], target_names=self.le_rec1.classes_),
            'Recommended_2': classification_report(y['Recommended_2'], preds['Recommended_2'], target_names=self.le_rec2.classes_),
            'Avoid': classification_report(y['Avoid'], preds['Avoid'], target_names=self.le_avoid.classes_)
        }
        
        print("Model Accuracy Report:")
        print("="*50)
        for target in accuracies:
            print(f"{target} Accuracy: {accuracies[target]:.2%}")
            print(f"\nClassification Report for {target}:")
            print(reports[target])
            print("-"*50)
        
        print(f"\nJoint Accuracy (All Correct): {joint_accuracy:.2%}")
        print("="*50)

# 8. Execution
if __name__ == "__main__":
    df = load_and_clean_data()
    advisor = FinancialAdvisor()
    advisor.train(df)
    advisor.evaluate(df)
