import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.preprocessing import QuantileTransformer
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer, SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import shap
from category_encoders import TargetEncoder
from sklearn.preprocessing import FunctionTransformer  # Add this at the top
from sklearn.base import TransformerMixin

class TypeConverter(TransformerMixin):
    def __init__(self, dtype=float):
        self.dtype = dtype
        
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.astype(self.dtype)
    
    def get_feature_names_out(self, input_features=None):
        if input_features is None:
            return np.array([])
        return input_features

class FinancialAdvisorAI:
    def __init__(self):
        # Regression model for financial health score (0-100)
        self.regressor = Pipeline([
            ('preprocessor', ColumnTransformer([
                ('num', Pipeline([
                    ('imputer', IterativeImputer()),
                    ('scaler', QuantileTransformer(output_distribution='normal'))
                ]), ['income', 'monthly_savings', 'age']),
                ('cat', Pipeline([
                    ('imputer', SimpleImputer(strategy='most_frequent')),
                    ('encoder', TargetEncoder()),
                    ('type_converter', TypeConverter(float))
                ]), ['job_type', 'income_sources'])
            ], remainder='drop')),
            ('model', XGBRegressor(
                objective='reg:squarederror',
                tree_method='hist',
                n_estimators=200,
                max_depth=5,
                enable_categorical=False
            ))
        ])
        self.explainer = None
        self.feature_names = []

    def create_features(self, df):
        # Financial Ratios
        df['savings_rate'] = np.where(
        df['income'] > 0,
        df['monthly_savings'] / df['income'],
        0  # Handle zero income cases
    )
        
        # Life Stage Scoring
        df['life_stage'] = np.where(
            df['age'] < 30, 'early_career',
            np.where(df['age'] < 50, 'mid_career', 'pre_retirement')
        )
        
        # Expense Analysis
        df['discretionary_spending'] = np.where(
        df['live_alone'].str.lower() == 'yes',
        df['entertainment_alone'].fillna(0),
        df['entertainment_family'].fillna(0)
    
        )
        df['discretionary_spending'] = np.where(
        df['income'] > 0,
        df['discretionary_spending'] / df['income'],
        0
    )
        
        return df

    def train(self, X, y_score):
    # Train model first
      self.regressor.fit(X, y_score)
    
    # Then get feature names
      self.feature_names = self.regressor.named_steps['preprocessor'].get_feature_names_out()
    
    # Prepare explainer with feature names
      self.explainer = shap.TreeExplainer(self.regressor.named_steps['model'])
        
    def predict_advice(self, X):
        # Get processed features
        X_processed = self.regressor.named_steps['preprocessor'].transform(X)
        scores = self.regressor.predict(X)
        
        # Generate SHAP values
        shap_values = self.explainer.shap_values(X_processed)
        
        # Clean feature names (remove transformer prefixes)
        clean_names = [name.split('__')[-1] for name in self.feature_names]
        
        advice = []
        for i, score in enumerate(scores):
            # Determine strategy
            if score < 30:
                strategy = "Conservative Portfolio: 70% Bonds, 20% FD, 10% Gold"
            elif score < 70:
                strategy = "Balanced Portfolio: 50% Mutual Funds, 30% Stocks, 20% REITs"
            else:
                strategy = "Aggressive Growth: 40% Growth Stocks, 30% Crypto, 30% Venture Capital"

            # Get top features with clean names
            top_features = pd.DataFrame({
                'feature': clean_names,
                'impact': shap_values[i]
            }).nlargest(3, 'impact')

            reasons = [
                f"Your {row['feature']} contributes {abs(row['impact']):.1f} points to your score"
                for _, row in top_features.iterrows()
            ]

            advice.append({
                'score': score,
                'strategy': strategy,
                'key_factors': reasons,
                'risk_level': np.clip(score/10, 1, 10)
            })
        
        return pd.DataFrame(advice)

def generate_training_data(real_data):
    synthetic = pd.DataFrame()
    synthetic['score'] = (
        0.6 * real_data['savings_rate'].fillna(0) +
        0.4 * (1 - real_data['discretionary_spending'].fillna(0))
    ) * 100
    synthetic['score'] = np.clip(synthetic['score'], 0, 100)
    synthetic = synthetic.dropna(subset=['score'])
    return synthetic

def evaluate_model(model, X_test, y_test, strategies):
    pred_scores = model.predict(X_test)
    print(f"MAE: {mean_absolute_error(y_test, pred_scores):.2f}")
    print(f"R²: {r2_score(y_test, pred_scores):.2f}")
    
    correct_strategy = np.mean([
        (score < 30 and "Conservative" in strategy) or
        (30 <= score < 70 and "Balanced" in strategy) or
        (score >= 70 and "Aggressive" in strategy)
        for score, strategy in zip(pred_scores, strategies)
    ])
    print(f"Strategy Accuracy: {correct_strategy:.2%}")

# Sample usage
if __name__ == "__main__":
    # Load and preprocess data
    raw_data = pd.read_csv('optimized_advice_output.csv', dtype={
        'What is your personal income?': str,
        'How much do you save monthly?': str,
        'Age': str
    })
    
    # Clean and rename columns
    df = raw_data.rename(columns={
        'What is your personal income?': 'income',
        'How much do you save monthly?': 'monthly_savings',
        'Age': 'age',
        'What is your job?': 'job_type',
        'What categories of income do you currently have?': 'income_sources',
        'Do you live alone and cover your own expenses?': 'live_alone',
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': 'entertainment_alone',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly': 'entertainment_family'
    }).dropna(subset=['income', 'monthly_savings', 'age'])
    
    # Convert numerical columns
    # In the main execution block, modify these lines:
    df['income'] = pd.to_numeric(df['income'].str.replace(r'[^\d.]', '', regex=True), errors='coerce')
    df['monthly_savings'] = pd.to_numeric(df['monthly_savings'].str.replace(r'[^\d.]', '', regex=True), errors='coerce')
    df['age'] = pd.to_numeric(df['age'], errors='coerce')
    df = df.dropna(subset=['income', 'monthly_savings', 'age'])
    
    # Initialize and process data
    advisor = FinancialAdvisorAI()
    processed_df = advisor.create_features(df)
    
    # Generate synthetic scores
    synthetic_scores = generate_training_data(processed_df)
    
    # Prepare features and target
    X = processed_df[['income', 'monthly_savings', 'age', 'job_type', 'income_sources']]
    y = synthetic_scores['score']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train model
    advisor.train(X_train, y_train)
    
    # Evaluate
    test_predictions = advisor.predict_advice(X_test)
    evaluate_model(advisor.regressor, X_test, y_test, test_predictions['strategy'])
    
    # Example prediction
    sample_data = pd.DataFrame([{
        'income': 75000,
        'monthly_savings': 5000,
        'age': 35,
        'job_type': 'Engineer',
        'income_sources': 'Salary, Investments'
    }])
    print(advisor.predict_advice(sample_data))