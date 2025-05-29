from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from huggingface_hub import InferenceClient
from pydantic import BaseModel
from typing import List, Dict

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Load Models ---
kproto = joblib.load('kproto_model.pkl')
scaler = joblib.load('scaler.pkl')
pca = joblib.load('pca_model.pkl')


# --- Helper Functions (reused from your code) ---
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

    cluster_features = [
        'Are you employed?', 'What is your job?', 'Do you have a vehicle/s?',
        'What is your personal income?', 'savings_ratio', 'wants_needs_ratio',
        'How many people are in your house?', 'wealth_indicator'
    ]
    return new_user_df[cluster_features]


def predict_cluster(new_user_df):
    processed_data = preprocess_new_data(new_user_df)

    numerical_cols = [
        'What is your personal income?', 'savings_ratio',
        'wants_needs_ratio', 'How many people are in your house?',
        'wealth_indicator'
    ]
    scaled_numerical = scaler.transform(processed_data.loc[:, numerical_cols])
    numerical_pca = pca.transform(scaled_numerical[:, :4])

    categorical_data = processed_data.iloc[:, [0, 1, 2]].to_numpy()
    data_matrix = np.hstack((categorical_data, numerical_pca))
    categorical_indexes = [0, 1, 2]

    cluster = kproto.predict(data_matrix, categorical=categorical_indexes)[0]
    return cluster


def get_cluster_advice(cluster):
    advice = {
        0: "Invest 80% of savings in low-risk bonds. Review estate planning.",
        1: "Automate 5% more savings monthly. Explore freelance opportunities.",
        2: "Diversify investments: 60% stocks, 30% bonds, 10% crypto.",
        3: "Refinance mortgage. Use 529 plans for education savings.",
        4: "Cancel 2 subscriptions. Use cash envelopes for dining out.",
        5: "Apply for SNAP benefits. Visit food banks weekly."
    }
    return advice.get(cluster, "Track expenses daily using our app.")


# --- LLM Integration ---
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
            token="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"  # Replace this securely in prod
        )
        self.news_client = NewsDataClient()

    def generate_strategies(self, profile: FinancialProfile) -> List[Dict]:
        context = self._create_context(profile)
        try:
            response = self.generator.text_generation(
                prompt=self._build_prompt(context),
                max_new_tokens=300,
                temperature=0.7
            )
            return self._parse_strategies(response)
        except Exception as e:
            print(f"❌ API Error: {e}")
            return self._get_fallback_strategies()

    def _create_context(self, profile: FinancialProfile) -> str:
        return f"""
User Profile (Sri Lanka):
- Income: LKR{profile.income:,.2f}/month
- Expenses: LKR{profile.expenses:,.2f}
- Savings: LKR{profile.savings:,.2f}
- Investments: LKR{profile.investments:,.2f}
- Risk: {profile.risk_tolerance.title()}
"""

    def _build_prompt(self, context: str) -> str:
        return f"""Generate 2 financial strategies for:
{context}
Format as:
- Cause: [economic factor]
- Effect: [recommended action]
- Rationale: [1-sentence explanation]
"""

    def _parse_strategies(self, text: str) -> List[Dict]:
        strategies, lines = [], [line.strip() for line in text.split('\n') if line.strip()]
        i = 0
        while i < len(lines):
            if lines[i].lower().startswith("cause:"):
                cause = lines[i].split(":", 1)[1].strip()
                effect = lines[i+1].split(":", 1)[1].strip() if i+1 < len(lines) else ""
                rationale = lines[i+2].split(":", 1)[1].strip() if i+2 < len(lines) else ""
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

    def _get_fallback_strategies(self):
        return [
            {"cause": "High inflation", "effect": "Invest in inflation-indexed bonds", "rationale": "Protects against rupee depreciation"},
            {"cause": "Low interest rates", "effect": "Consider dividend stocks", "rationale": "Better returns than savings accounts"}
        ]


advice_system = FinancialAdviceSystem()

# --- Flask Routes ---

@app.route("/predict-cluster", methods=["POST"])
def predict_user_cluster():
    data = request.json
    df = pd.DataFrame([data])
    cluster = predict_cluster(df)
    return jsonify({
        "cluster": int(cluster),
        "advice": get_cluster_advice(cluster)
    })


@app.route("/generate-strategy", methods=["POST"])
def generate_strategy():
    data = request.json
    profile = FinancialProfile(**data)
    strategies = advice_system.generate_strategies(profile)
    return jsonify(strategies)


# --- Run Server ---
if __name__ == "__main__":
    app.run(debug=True)
