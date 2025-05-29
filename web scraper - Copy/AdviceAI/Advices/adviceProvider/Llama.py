import pandas as pd
import numpy as np
import joblib
from typing import List, Dict
from pydantic import BaseModel
from huggingface_hub import InferenceClient

# --- Clustering Components ---
# Load saved models: K-Prototypes, Scaler, and PCA
kproto = joblib.load('kproto_model copy.pkl')
scaler = joblib.load('scaler.pkl')
pca = joblib.load('pca_model.pkl')  # PCA was fitted on 4 numerical features

def preprocess_new_data(new_user_df):
    """Preprocess new user data for clustering and extract financial metrics."""
    binary_map = {'Yes': 1, 'No': 0}
    
    # Convert binary fields
    for col in ['Are you employed?', 'Do you have a vehicle/s?', 'Do you live alone and cover your own expenses?']:
        new_user_df.loc[:, col] = new_user_df[col].map(binary_map)

    # Handle conditional spending fields
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

    # Create financial ratios
    new_user_df['savings_ratio'] = new_user_df['How much do you save monthly?'] / new_user_df['What is your personal income?']
    new_user_df['wants_needs_ratio'] = new_user_df['unwanted_spending'] / new_user_df['basic_needs']
    
    # Wealth indicator
    new_user_df['wealth_indicator'] = new_user_df['What is your personal income?']
    
    # Handle NaNs
    new_user_df.fillna(0, inplace=True)

    # Calculate financial metrics for advice generation
    total_expenses = (new_user_df['unwanted_spending'] + new_user_df['basic_needs']).iloc[0]
    monthly_savings = new_user_df['How much do you save monthly?'].iloc[0]

    # Select clustering features
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
    """Predict cluster and return financial metrics."""
    # Preprocess data
    processed_data, expenses, savings = preprocess_new_data(new_user_df)
    
    # Define numerical columns
    numerical_cols = [
        'What is your personal income?', 
        'savings_ratio', 
        'wants_needs_ratio', 
        'How many people are in your house?', 
        'wealth_indicator'
    ]
    
    # Scale numerical features
    scaled_numerical = scaler.transform(processed_data.loc[:, numerical_cols])
    
    # Apply PCA
    numerical_pca = pca.transform(scaled_numerical[:, :4])
    
    # Prepare data matrix
    categorical_data = processed_data.iloc[:, [0, 1, 2]].to_numpy()
    data_matrix = np.hstack((categorical_data, numerical_pca))
    
    # Predict cluster
    cluster = kproto.predict(data_matrix, categorical=[0, 1, 2])[0]
    
    return cluster, expenses, savings

# --- Financial Advice Components ---
class FinancialProfile(BaseModel):
    income: float
    expenses: float
    savings: float
    investments: float
    risk_tolerance: str

class NewsDataClient:
    def get_last_24h_news(self):
        return [
            "Central Bank maintains interest rates",
            "Colombo Stock Exchange shows gains",
            "Tourism sector recovery continues"
        ]

class FinancialAdviceSystem:
    def __init__(self):
        self.generator = InferenceClient(
            model="HuggingFaceH4/zephyr-7b-beta",
            token="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"
        )
        self.news_client = NewsDataClient()
        self.cluster_risk_map = {
            0: 'low',
            1: 'medium',
            2: 'high',
            3: 'low',
            4: 'medium',
            5: 'low'
        }

    def create_profile(self, cluster: int, income: float, expenses: float, savings: float) -> FinancialProfile:
        """Create financial profile based on cluster characteristics."""
        return FinancialProfile(
            income=income,
            expenses=expenses,
            savings=savings * 12,  # Annualize monthly savings
            investments=income*0.1,  # Placeholder assumption
            risk_tolerance=self.cluster_risk_map.get(cluster, 'medium')
        )

    def generate_strategies(self, cluster: int, income: float, expenses: float, savings: float) -> List[Dict]:
        """Generate personalized financial strategies."""
        profile = self.create_profile(cluster, income, expenses, savings)
        context = self._create_context(profile)
        strategies = self._generate_candidate_strategies(context)
        return self._add_market_analysis(strategies)

    def _create_context(self, profile: FinancialProfile) -> str:
        return f"""User Profile:
        - Monthly Income: LKR{profile.income/12:,.0f}
        - Monthly Expenses: LKR{profile.expenses:,.0f}
        - Annual Savings: LKR{profile.savings:,.0f}
        - Risk Tolerance: {profile.risk_tolerance.title()}"""
   
    def _generate_candidate_strategies(self, context: str) -> List[Dict]:
        prompt = f"""Generate 2 financial strategies for:
{context}

Format as:
- Cause: [economic factor]
- Effect: [recommended action]
- Rationale: [1-sentence explanation]

IMPORTANT: Do NOT include any examples, templates, or placeholder text like [Name of Strategy]."""
        try:
            print("Attempting API call...")
            response = self.generator.text_generation(
                prompt,
                max_new_tokens=300,
                temperature=0.7
            )
            print("API Response Received!")
            print("Raw Response:", response)
            print("Raw Response:sdfxgchjasertfyg")
            if "Cause:" in response and "Effect:" in response:
                print("✅ Successfully parsed strategies from API")
                strategies = self._parse_strategies(response)
                return self._add_market_analysis(strategies)
            else:
                print("⚠️ API returned unexpected format, using fallback")
                return self._get_fallback_strategies()

        except Exception as e:
            print(f"❌ API Failed: {e}")
            return self._get_fallback_strategies()

    def _parse_strategies(self, text: str) -> List[Dict]:
        """Strict parser that ignores template lines"""
        strategies = []
        current = {}

        # Split into lines and clean
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        i = 0
        while i < len(lines):
            line = lines[i]

            # Skip template headers and markers
            if any(marker in line for marker in ["Strategy X:", "[", "]:"]):
                i += 1
                continue

            # Look for complete strategy blocks
            if line.lower().startswith('cause:'):
                cause = line.split(':', 1)[1].strip()
                effect = lines[i+1].split(':', 1)[1].strip() if i+1 < len(lines) else ""
                rationale = lines[i+2].split(':', 1)[1].strip() if i+2 < len(lines) else ""

                if effect and rationale:
                    strategies.append({
                        "cause": cause,
                        "effect": effect,
                        "rationale": rationale
                    })
                    i += 3
                    continue

            i += 1

        return strategies if strategies else self._get_fallback_strategies()

    def _get_fallback_strategies(self) -> List[Dict]:
         return []

    def _add_market_analysis(self, strategies: List[Dict]) -> List[Dict]:
        news = self.news_client.get_last_24h_news()
        for strategy in strategies:
            strategy['market_sentiment'] = self._analyze_sentiment(strategy['effect'], news)
        return strategies

    def _analyze_sentiment(self, text: str, news: List[str]) -> str:
        positive = any(word in text.lower() for word in ['gain', 'growth'])
        return 'positive' if positive else 'neutral'
from flask import jsonify
# --- Run the app ---
if __name__ == "__main__":
    # Wrap in Flask-like response structure
    def generate_response():
        # New user data
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

        # Predict cluster and get financial metrics
        cluster, expenses, savings = predict_cluster(new_user)
        income = new_user['What is your personal income?'].iloc[0]

        # Generate advice
        advisor = FinancialAdviceSystem()
        strategies = advisor.generate_strategies(int(cluster), float(income), 
                      float(expenses), float(savings))
        print("yyyy")
        print(strategies)
        # Structure response
        response_data = {
            "cluster": int(cluster),
            "strategies": [{
                "cause": str(s['cause']),
                "effect": str(s['effect']),
                "rationale": str(s['rationale']),
                "market_sentiment": str(s.get('market_sentiment', 'neutral'))
            } for s in strategies]
        }
        
        return jsonify(response_data)
    print("ttttttt")
    
    # Simulate Flask response generation
    response = generate_response()
    print("Structured Response:")
    print(response.get_data(as_text=True))

