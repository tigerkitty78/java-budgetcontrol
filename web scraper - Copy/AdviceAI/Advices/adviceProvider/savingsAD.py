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
import os
import matplotlib.pyplot as plt
import joblib
import random

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier, plot_importance
from sklearn.impute import SimpleImputer
import joblib

# 1. Load raw data with validation
def load_raw_data():
    df = pd.read_csv('savingsdata_processed.csv')
    df.columns = df.columns.str.strip()
    
    required_columns = [
        'Age', 'What is your personal income?', 'How much do you save monthly?',
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend on basic needs monthly?'
    ]
    
    missing = list(set(required_columns) - set(df.columns))
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    
    # Merge unwanted spending
    df['Unwanted Spending'] = (
        df['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'] +
        df['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']
    )

    # Merge basic needs spending
    df['Basic Needs Spending'] = (
        df['If you live alone, How much do you spend on basic needs monthly?'] +
        df['If you live with family How much do you spend on basic needs monthly?']
    )

    # Clean target columns
    targets = ['Advice 1', 'Advice 2', 'Advice 3']
    for col in targets:
        df[col] = df[col].str.strip()

    return df.dropna(subset=['Age']).copy()

# 2. Model Pipeline with Basic Preprocessing
def create_pipeline(model_type='xgboost'):
    # Define raw features to use
    numerical_features = [
                'Age', 'What is your personal income?', 'How much do you save monthly?',
        'Unwanted Spending', 'Basic Needs Spending'
    ]
    
    categorical_features = []
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean')),
        ('scaler', StandardScaler())
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features)
        ]
    )

    
    if model_type == 'random_forest':
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=7,
            class_weight='balanced',
            random_state=42
        )
    elif model_type == 'xgboost':
       model = XGBClassifier(
    n_estimators=2,        # Lowered
    max_depth=2,            # Less complex
    learning_rate=0.3,      # Less precise learning
    subsample=0.5,
    reg_lambda=1.0,
    use_label_encoder=False,
    eval_metric='logloss'
)
    else:
        raise ValueError("Unsupported model type")
    
    return Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])

# 3. Financial Advisory System
class FinancialAdvisorSystem:
    def __init__(self, model_type='xgboost'):
        self.models = {
            'Advice 1': create_pipeline(model_type),
            'Advice 2': create_pipeline(model_type),
            'Advice 3': create_pipeline(model_type)
        }
        self.label_encoders = {}
    
    def train(self, X_train, y_train):
        for target in y_train.columns:
            print(f"\nTraining {target} model...")
            self.models[target].fit(X_train, y_train[target])
    
    def evaluate(self, X_test, y_test):
        results = {}
        for target in y_test.columns:
            y_pred = self.models[target].predict(X_test)
            acc = accuracy_score(y_test[target], y_pred)
            report = classification_report(y_test[target], y_pred)
            results[target] = {'accuracy': acc, 'report': report}
        return results
    
    def analyze_features(self, X, y):
        print("\nFeature Importances:")
        for target in y.columns:
            try:
                plot_importance(self.models[target].named_steps['classifier'])
                plt.title(f'{target} Feature Importance')
                plt.show()
            except AttributeError:
                print(f"Cannot show feature importance for {target} model")
    def get_feature_names(self, input_df):
        print("\nFeatures used by each model (after preprocessing):")
        for target, pipeline in self.models.items():
            preprocessor = pipeline.named_steps['preprocessor']
        
            num_features = preprocessor.transformers_[0][2]
            cat_features = preprocessor.transformers_[1][2]
        
        # Get actual names after one-hot encoding
            cat_encoder = preprocessor.named_transformers_['cat']
            try:
                 cat_encoded = cat_encoder.get_feature_names_out(cat_features)
            except AttributeError:
                 cat_encoded = cat_encoder.get_feature_names(cat_features)  # For older versions of sklearn
        
            feature_names = np.concatenate([num_features, cat_encoded])
            print(f"\n{target} Model Features:")
            print(feature_names)

    def save_models(self, directory='models'):
        os.makedirs(directory, exist_ok=True)
        for target, model in self.models.items():
            filename = os.path.join(directory, f'{target.replace(" ", "_").lower()}_model.joblib')
            joblib.dump(model, filename)
        print(f"Models saved in '{directory}' directory.")

# 4. Main Execution
if __name__ == "__main__":
    try:
        # Load and prepare data
        raw_df = load_raw_data()
        
        # Separate features and targets
        X = raw_df.drop(['Advice 1', 'Advice 2', 'Advice 3'], axis=1)
        y = raw_df[['Advice 1', 'Advice 2', 'Advice 3']]
        
        # Encode targets
        label_encoders = {}
        for col in y.columns:
            le = LabelEncoder()
            y[col] = le.fit_transform(y[col])
            label_encoders[col] = le
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=0.2, 
            stratify=y['Advice 1'],
            random_state=42
        )
        
        # Initialize and train system
        advisor = FinancialAdvisorSystem(model_type='xgboost')
        advisor.train(X_train, y_train)
        
        # Evaluate
        results = advisor.evaluate(X_test, y_test)
        
        # Show results
        for target, metrics in results.items():
            print(f"\n{target} Model:")
            print(f"Accuracy: {metrics['accuracy']:.2%}")
            print("Classification Report:")
            print(metrics['report'])
        
        # Feature analysis
        advisor.analyze_features(X_train, y_train)
        
        # Save components
        advisor.save_models(directory='models')

        joblib.dump(label_encoders, 'sav_label_encoders.joblib')
    
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        print("\nExecution completed")