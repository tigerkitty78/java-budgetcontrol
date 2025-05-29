import pandas as pd
import numpy as np
import joblib
from typing import List, Dict
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import os
import json

# --- Clustering Components ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

kproto = joblib.load(os.path.join(BASE_DIR, 'kproto_model.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
pca = joblib.load(os.path.join(BASE_DIR, 'pca_model.pkl'))

def preprocess_new_data(new_user_df):
    binary_map = {'Yes': 1, 'No': 0}
    
    for col in ['Are you employed?', 'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?']:
        new_user_df.loc[:, col] = new_user_df[col].map(binary_map)

    new_user_df['unwanted_spending'] = np.where(
        new_user_df['Do you live alone and cover your own expenses?'] == 1,
        new_user_df['If you live alone... (unwanted spending)'],
        new_user_df['If you live with family... (unwanted spending)']
    )
    
    new_user_df['basic_needs'] = np.where(
        new_user_df['Do you live alone and cover your own expenses?'] == 1,
        new_user_df['If you live alone... (basic needs)'],
        new_user_df['If you live with family... (basic needs)']
    )

    new_user_df['savings_ratio'] = new_user_df['How much do you save monthly?'] / new_user_df['What is your personal income?']
    new_user_df['wants_needs_ratio'] = new_user_df['unwanted_spending'] / new_user_df['basic_needs']
    new_user_df['wealth_indicator'] = new_user_df['What is your personal income?']
    new_user_df.fillna(0, inplace=True)

    total_expenses = (new_user_df['unwanted_spending'] + new_user_df['basic_needs']).iloc[0]
    monthly_savings = new_user_df['How much do you save monthly?'].iloc[0]

    cluster_features = [
        'Are you employed?', 
        'What is your job?', 
        'Do you have a vehicle/s?',
        'What is your personal income?',
        'savings_ratio',
        'wants_needs_ratio',
        'How many people are in your house?',
        'wealth_indicator'
    ]
    
    return new_user_df[cluster_features], total_expenses, monthly_savings

def predict_cluster(new_user_df):
    processed_data, expenses, savings = preprocess_new_data(new_user_df)

    numerical_cols = [
        'What is your personal income?', 
        'savings_ratio', 
        'wants_needs_ratio', 
        'How many people are in your house?', 
        'wealth_indicator'
    ]
    
    scaled_numerical = scaler.transform(processed_data.loc[:, numerical_cols])
    numerical_pca = pca.transform(scaled_numerical[:, :4])

    categorical_data = processed_data.iloc[:, [0, 1, 2]].to_numpy()
    data_matrix = np.hstack((categorical_data, numerical_pca))

    cluster = kproto.predict(data_matrix, categorical=[0, 1, 2])[0]
    
    return cluster, expenses, savings

# --- Financial Advice Components ---
from typing import List, Dict
from pydantic import BaseModel
import pandas as pd
import json
from huggingface_hub import InferenceClient

# Define the user profile model
class FinancialProfile(BaseModel):
    income: float
    expenses: float
    savings: float
    investments: float
    risk_tolerance: str

# Define the financial advice system
class FinancialAdviceSystem:
    def __init__(self):
        self.generator = InferenceClient(
            model="HuggingFaceH4/zephyr-7b-beta",
            token="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",
            timeout=30
        )
        self.cluster_risk_map = {
            0: 'low', 1: 'medium', 2: 'high', 3: 'low', 4: 'medium', 5: 'low'
        }

    def generate_strategies(self, cluster: int, income: float, expenses: float, savings: float) -> List[Dict]:
        profile = self._create_profile(cluster, income, expenses, savings)
        context = self._create_context(profile)
        return self._generate_candidate_strategies(context)

    def _create_profile(self, cluster: int, income: float, expenses: float, savings: float) -> FinancialProfile:
        return FinancialProfile(
            income=income,
            expenses=expenses,
            savings=savings * 12,
            investments=income * 0.1,
            risk_tolerance=self.cluster_risk_map.get(cluster, 'medium')
        )

    def _create_context(self, profile: FinancialProfile) -> str:
        return f"""User Profile:
- Monthly Income: LKR{profile.income:,.0f}
- Monthly Expenses: LKR{profile.expenses:,.0f}
- Annual Savings: LKR{profile.savings:,.0f}
- Risk Tolerance: {profile.risk_tolerance.title()}"""

    def _generate_candidate_strategies(self, context: str) -> List[Dict]:
        prompt = f"""Generate 2 financial strategies for:
{context}

Format EXACTLY like this:
Cause: [economic factor]
Effect: [recommended action]
Rationale: [1-sentence explanation]

Do NOT use markdown, JSON, or any special formatting."""

        try:
            print("\n--- JSON Payload to Hugging Face API ---")
            print(json.dumps({"prompt": prompt}, indent=4))

            print("\nSending request to Hugging Face API...")
            response = self.generator.text_generation(
                prompt,
                max_new_tokens=400,
                temperature=0.7,
                repetition_penalty=1.2
            )
            print("API Response:\n", response)
            return self._parse_response(response)

        except Exception as e:
            print(f"API Error: {str(e)}")
            return self._get_fallback_strategies()

    def _parse_response(self, text: str) -> List[Dict]:
        lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
        strategies = []
        strategy = {}
        for line in lines:
            if line.startswith("Cause:"):
                strategy["cause"] = self._clean_line(line, "Cause:")
            elif line.startswith("Effect:"):
                strategy["effect"] = self._clean_line(line, "Effect:")
            elif line.startswith("Rationale:"):
                strategy["rationale"] = self._clean_line(line, "Rationale:")
                strategies.append(strategy)
                strategy = {}
        return strategies if strategies else self._get_fallback_strategies()

    def _clean_line(self, text: str, prefix: str) -> str:
        return text[len(prefix):].strip()

    def _get_fallback_strategies(self) -> List[Dict]:
        return [
            {
                "cause": "Economic inflation pressures",
                "effect": "Allocate more funds to essential needs and reduce luxury spending",
                "rationale": "Reducing unnecessary spending ensures financial stability during inflation."
            },
            {
                "cause": "Stock market volatility",
                "effect": "Invest in low-risk government bonds or fixed deposits",
                "rationale": "Low-risk assets preserve capital during uncertain times."
            }
        ]

# Dummy cluster prediction logic (Replace with your actual model logic)
def predict_cluster(df: pd.DataFrame):
    cluster = 0  # default or predicted cluster
    expenses = df['If you live alone... (basic needs)'].iloc[0] + df['If you live alone... (unwanted spending)'].iloc[0]
    savings = df['How much do you save monthly?'].iloc[0]
    return cluster, expenses, savings

# --- Run the app ---
if __name__ == "__main__":
    new_user = pd.DataFrame([{
        'Are you employed?': 'Yes',
        'What is your job?': 'Teacher',
        'Do you have a vehicle/s?': 'No',
        'Do you live alone and cover your own expenses?': 'Yes',
        'What is your personal income?': 65000,
        'How much do you save monthly?': 5000,
        'If you live alone... (unwanted spending)': 1000,
        'If you live with family... (unwanted spending)': 0,
        'If you live alone... (basic needs)': 2000,
        'If you live with family... (basic needs)': 0,
        'How many people are in your house?': 3
    }])

    cluster, expenses, savings = predict_cluster(new_user)
    income = new_user['What is your personal income?'].iloc[0]

    advisor = FinancialAdviceSystem()
    strategies = advisor.generate_strategies(cluster, income, expenses, savings)

    print(f"\nPredicted Cluster: {cluster}")
    for i, strategy in enumerate(strategies, 1):
        print(f"\nStrategy {i}:")
        print(f"Cause: {strategy['cause']}")
        print(f"Action: {strategy['effect']}")
        print(f"Rationale: {strategy['rationale']}")