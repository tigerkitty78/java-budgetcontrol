from flask import Flask, request, jsonify
import pandas as pd
import joblib
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
import traceback
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)  
class EnhancedFeatureEngineer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.feature_names = [
            'What is your personal income?', 'How much do you save monthly?',
            'Age', 'savings_ratio', 'wants_ratio', 'What is your job?',
            'emergency_fund_months', 'debt_income_ratio', 'impulse_spend_ratio', 'age_group'
        ]
        self.expected_columns = [
            'Age', 'What is your personal income?', 'How much do you save monthly?',
            'Do you live alone and cover your own expenses?',
            'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
            'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
            'If you live alone, How much do you spend on basic needs monthly?',
            'If you live with family How much do you spend on basic needs monthly?',
            'What is your job?', 'Debt'
        ]

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X, columns=self.expected_columns)
        
        X = X.copy()
        numeric_cols = ['Age', 'What is your personal income?', 'How much do you save monthly?', 'Debt']
        for col in numeric_cols:
            X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)

        cond = X['Do you live alone and cover your own expenses?'] == 1
        X['unwanted_spending'] = (
            X['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']
            .where(cond, X['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'])
            .fillna(0)
        )
        X['basic_needs'] = (
            X['If you live alone, How much do you spend on basic needs monthly?']
            .where(cond, X['If you live with family How much do you spend on basic needs monthly?'])
            .replace(0, 1)
            .fillna(1)
        )

        X['savings_ratio'] = X['How much do you save monthly?'] / X['What is your personal income?'].replace(0, 1)
        X['wants_ratio'] = X['unwanted_spending'] / X['basic_needs']
        X['emergency_fund_months'] = X['How much do you save monthly?'] / X['basic_needs']
        X['debt_income_ratio'] = X['Debt'] / (X['What is your personal income?'] + 1)
        X['impulse_spend_ratio'] = X['unwanted_spending'] / (X['What is your personal income?'] + 1)
        X['age_group'] = pd.cut(X['Age'], bins=[0, 20, 30, 40, 50, 60, 100], labels=False).fillna(0)

        return X[self.feature_names].fillna(0)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = request.json
        label_encoders = joblib.load('label_encoders_INTERRUPTED.joblib')
        models = {
            'Recommended_1': joblib.load('Recommended1_3_model.joblib'),
            'Recommended_2': joblib.load('Recommended2_3_model.joblib'),
            'Avoid': joblib.load('Avoid_3_model.joblib')
        }
        input_df = pd.DataFrame([input_data])
        print("Available model keys:", models.keys())
        print("Label encoder keys:", label_encoders.keys())

        key_mapping = {
            'Recommended_1': 'Recommended1',
            'Recommended_2': 'Recommended2',
            'Avoid': 'Avoid'
        }

        predictions = {}
        for model_key, label_key in key_mapping.items():
            pred = models[model_key].predict(input_df)[0]
            predictions[label_key] = label_encoders[label_key].inverse_transform([pred])[0]
        print("Prediction ", predictions)
        return jsonify(predictions)

    except Exception as e:
        print("Prediction error:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
