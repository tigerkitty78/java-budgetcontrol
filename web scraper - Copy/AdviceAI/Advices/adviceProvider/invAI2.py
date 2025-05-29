import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier, plot_importance
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from scikeras.wrappers import KerasClassifier

import matplotlib.pyplot as plt
import joblib
import random

# 1. Load raw data
def load_raw_data():
    df = pd.read_csv('advicedata.csv')
    df.columns = df.columns.str.strip()
    df[['Recommended1', 'Recommended2', 'Avoid']] = df['investment advice'].str.extract(
        r'Recommended: (.*?), (.*?)\. Avoid: (.*)\.?'
    )
    
    required_columns = [
        'Age', 'What is your personal income?', 'How much do you save monthly?',
        # 'Do you live alone and cover your own expenses?', 
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'What is your job?',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend on basic needs monthly?'
    ]
    # Merge unwanted expenses columns
    df['unwanted_expenses'] = df[
    'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'
    ].fillna(
    df['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']
)

# Merge basic needs expenses columns
    df['basic_needs_expenses'] = df[
    'If you live alone, How much do you spend on basic needs monthly?'
    ].fillna(
    df['If you live with family How much do you spend on basic needs monthly?']
   )
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    
    df['Recommended1'] = df['Recommended1'].str.strip()
    df['Recommended2'] = df['Recommended2'].str.strip()
    df['Avoid'] = df['Avoid'].str.strip()
    
    return df[~pd.isna(df['Age'])].copy()

# 2. Enhanced Feature Engineering
class EnhancedFeatureEngineer:
    def __init__(self):
        self.feature_names = []

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()

        # Handle missing values
        X['How much do you save monthly?'] = X['How much do you save monthly?'].fillna(0)
        X['What is your personal income?'] = X['What is your personal income?'].replace(0, 1)

        # Merged columns for unwanted and basic needs spending
        X['unwanted_spending'] = pd.to_numeric(
            X['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'],
            errors='coerce'
        ).fillna(0) + pd.to_numeric(
            X['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'],
            errors='coerce'
        ).fillna(0)

        X['basic_needs'] = (
            pd.to_numeric(X['If you live alone, How much do you spend on basic needs monthly?'], errors='coerce')
            .fillna(0) +
            pd.to_numeric(X['If you live with family How much do you spend on basic needs monthly?'], errors='coerce')
            .fillna(0)
        ).replace(0, 1)

        # Financial features
        X['emergency_fund_months'] = X['How much do you save monthly?'] / X['basic_needs']
        X['debt_income_ratio'] = X.get('Debt', 0) / (X['What is your personal income?'] + 1)
        # Behavioral features
        X['impulse_spend_ratio'] = X['unwanted_spending'] / (X['What is your personal income?'] + 1)

        # Age binning
        X['age_group'] = pd.cut(X['Age'],
                                bins=[0, 20, 30, 40, 50, 60, 100],
                                labels=[0, 1, 2, 3, 4, 5]).fillna(0).astype(int)

        # Ratios
        X['savings_ratio'] = X['How much do you save monthly?'] / (X['What is your personal income?'] + 1e-6)
        X['wants_ratio'] = X['unwanted_spending'] / (X['basic_needs'] + 1e-6)

        # Replace infinities
        X = X.replace([np.inf, -np.inf], 0)

        # Final feature list
        self.feature_names = [
            'What is your personal income?', 'How much do you save monthly?',
            'Age', 'savings_ratio', 'wants_ratio','debt_income_ratio',
            'emergency_fund_months', 'impulse_spend_ratio', 'age_group'
        ]

        return X[self.feature_names].fillna(0)


# 3. Model Pipeline
def create_pipeline(model_type='xgboost'):
    preprocessor = ColumnTransformer([
        ('num', StandardScaler(), [
            'Age', 'What is your personal income?', 'How much do you save monthly?',
            'savings_ratio', 'wants_ratio', 'emergency_fund_months', 'debt_income_ratio',
            'impulse_spend_ratio', 'age_group'
        ])
        # No categorical encoder needed since 'What is your job?' was removed
    ])

    if model_type == 'random_forest':
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=7,
            class_weight='balanced_subsample',
            random_state=42
        )
    elif model_type == 'xgboost':
        model = XGBClassifier(
            n_estimators=500,
            max_depth=8,
            learning_rate=0.01,
            subsample=0.8,
            colsample_bytree=0.7,
            reg_alpha=0.5,
            reg_lambda=0.5,
            use_label_encoder=False,
            eval_metric='logloss'
        )
    elif model_type == 'dnn':
        model = KerasClassifier(build_fn=create_dnn, epochs=50, batch_size=32)
    else:
        raise ValueError("Unsupported model type")

    return Pipeline([
        ('engineer', EnhancedFeatureEngineer()),
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])


# 4. Deep Learning Model
def create_dnn():
    model = Sequential([
        Dense(128, activation='relu', input_shape=(12,)),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dense(32, activation='relu'),
        Dense(3, activation='softmax')
    ])
    model.compile(optimizer='adam', 
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy'])
    return model

# 5. Financial Advisory System
class FinancialAdvisorSystem:
    def __init__(self, model_type='xgboost'):
        self.models = {
            'Recommended1': create_pipeline(model_type),
            'Recommended2': create_pipeline(model_type),
            'Avoid': create_pipeline(model_type)
        }
        self.label_encoders = label_encoders or {}
        self.business_rules = {
            'LOLC (high-risk)': ['Avoid: Non-diversified portfolios'],
            'Offshore accounts': ['Avoid: Tax evasion']
        }

    def train(self, X_train, y_train):
        for target in y_train.columns:
            print(f"Training {target} model...")
            self.models[target].fit(X_train, y_train[target])
            
            # Save trained model
            joblib.dump(self.models[target], f"{target}_4_model.joblib")

    def evaluate(self, X_test, y_test):
        results = {}
        for target in y_test.columns:
            # Get numeric predictions
            y_pred_numeric = self.models[target].predict(X_test)
            
            # Decode to original labels
            y_pred_labels = self.label_encoders[target].inverse_transform(y_pred_numeric)
            
            # Apply business rules to labels
            if target == 'Avoid':
                y_pred_labels = [self.apply_business_rules(pred) for pred in y_pred_labels]
            
            # Re-encode for scoring
            y_pred_final = self.label_encoders[target].transform(y_pred_labels)
            
            acc = accuracy_score(y_test[target], y_pred_final)
            report = classification_report(y_test[target], y_pred_final)
            results[target] = {'accuracy': acc, 'report': report}
        return results
    
    

    def validate_predictions(self, y_pred, target):
        if target == 'Avoid':
            return [self.apply_business_rules(pred) for pred in y_pred]
        return y_pred

    def apply_business_rules(self, prediction):
        """Handle string predictions only"""
        for rule, replacements in self.business_rules.items():
            if rule in prediction:
                return random.choice(replacements)
        return prediction

    def cross_validate(self, X, y, cv_splits=5):
        print("\n--- Cross Validation Results ---")
        results = {}
        for target in y.columns:
            print(f"\nCross-validating {target}...")
            scores = cross_val_score(
                self.models[target], X, y[target],
                cv=TimeSeriesSplit(n_splits=cv_splits),
                scoring='accuracy'
            )
            results[target] = {
                'mean_accuracy': np.mean(scores),
                'std_accuracy': np.std(scores)
            }
        return results

    def tune_hyperparameters(self, X, y):
        param_grid = {
            'classifier__learning_rate': [0.01, 0.05, 0.1],
            'classifier__max_depth': [3, 5, 7],
            'classifier__subsample': [0.6, 0.8, 1.0],
            'classifier__colsample_bytree': [0.6, 0.8, 1.0]
        }
        
        for target in y.columns:
            print(f"Tuning {target} model...")
            gscv = GridSearchCV(self.models[target], param_grid, cv=3, scoring='accuracy')
            gscv.fit(X, y[target])
            self.models[target] = gscv.best_estimator_

    def analyze_features(self, X, y):
        for target in y.columns:
            self.models[target].fit(X, y[target])
            if 'XGBClassifier' in str(self.models[target].named_steps['classifier']):
                plot_importance(self.models[target].named_steps['classifier'])
                plt.title(f'{target} Feature Importance')
                plt.show()

    def create_ensemble(self):
        for target in ['Recommended1', 'Recommended2', 'Avoid']:
            xgb = create_pipeline('xgboost')
            rf = create_pipeline('random_forest')
            
            self.models[target] = VotingClassifier(
                estimators=[('xgb', xgb), ('rf', rf)],
                voting='soft'
            )

# 6. Main Execution
if __name__ == "__main__":
    try:
        # Encode labels
        raw_df = load_raw_data()
        X = raw_df.copy()
        y = raw_df[['Recommended1', 'Recommended2', 'Avoid']].copy()

        label_encoders = {}
        for col in y.columns:
            le = LabelEncoder()
            y[col] = le.fit_transform(y[col])
            label_encoders[col] = le

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Initialize system
        advisor = FinancialAdvisorSystem(model_type='xgboost')

        # Train and evaluate
        advisor.train(X_train, y_train)
        results = advisor.evaluate(X_test, y_test)

        # Display results
        for target, metrics in results.items():
            print(f"\n{target} Model:")
            print(f"Accuracy: {metrics['accuracy']:.2%}")
            print("Classification Report:")
            print(metrics['report'])

        # Feature analysis
        advisor.analyze_features(X_train, y_train)

        # Hyperparameter tuning
        advisor.tune_hyperparameters(X_train, y_train)

        # Cross-validation
        cv_results = advisor.cross_validate(X_train, y_train)

        # Save label encoders
        # joblib.dump(label_encoders, 'label_encoders3.joblib')

    except KeyboardInterrupt:
        print("\nTraining interrupted. Saving current progress...")
        joblib.dump(label_encoders, 'label_encoders_INTERRUPTED2.joblib')

    finally:
        print("Script execution completed")
        # Add any necessary cleanup here
