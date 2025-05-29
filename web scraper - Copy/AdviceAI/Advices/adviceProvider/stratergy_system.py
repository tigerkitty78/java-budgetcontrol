import requests
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import SGDRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import shap

class DynamicStrategyOptimizer:
    def __init__(self):
        # Initialize model for personal risk assessment
        self.personal_risk_model = Pipeline([
            ('scaler', StandardScaler()),
            ('model', SGDRegressor(warm_start=True))
        ])
        
        # Initialize market data cache
        self.market_data = {
            'last_updated': None,
            'volatility_index': 0.5,
            'bond_yields': 0.03,
            'market_sentiment': 0.7
        }
        
        # Initialize user profiles
        self.user_profiles = {}
        
        # SHAP explainer
        self.explainer = None

    def fetch_market_data(self):
        """Mock market data API call"""
        try:
            # Replace with real API endpoint
            response = requests.get('https://api.alphavantage.co/mock/risk-indicators',
                                   params={'apikey': 'YOUR_API_KEY'})
            data = response.json()
            
            self.market_data = {
                'last_updated': datetime.now(),
                'volatility_index': data.get('volatility', 0.5),
                'bond_yields': data.get('bond_yields', 0.03),
                'market_sentiment': data.get('sentiment', 0.7)
            }
        except:
            # Fallback to cached values if API fails
            pass

    def calculate_personal_risk(self, user_id):
        """Calculate personalized risk score (0-100)"""
        profile = self.user_profiles[user_id]
        
        # Feature engineering
        features = np.array([
            profile['age'],
            profile['savings_rate'] * 100,
            profile['debt_ratio'] * 100,
            len(profile['income_sources']),
            1 if profile['employed'] else 0
        ]).reshape(1, -1)
        
        # Predict risk score (0=low risk, 100=high risk)
        return self.personal_risk_model.predict(features)[0]

    def update_strategy(self, user_id):
        """Generate dynamic investment strategy"""
        # Get latest market data
        if not self.market_data['last_updated'] or \
           datetime.now() - self.market_data['last_updated'] > timedelta(hours=1):
            self.fetch_market_data()
        
        # Calculate scores
        personal_risk = self.calculate_personal_risk(user_id)
        market_risk = self.market_data['volatility_index'] * 100
        
        # Blended risk score
        blended_risk = 0.7 * personal_risk + 0.3 * market_risk
        
        # Dynamic allocation rules
        if blended_risk < 30:
            return self._conservative_strategy()
        elif blended_risk < 70:
            return self._balanced_strategy()
        else:
            return self._aggressive_strategy()

    def _conservative_strategy(self):
        return {
            'stocks': 30,
            'bonds': 50,
            'crypto': 5,
            'reits': 10,
            'cash': 5,
            'rationale': 'Low risk tolerance and stable markets'
        }

    def _balanced_strategy(self):
        return {
            'stocks': 50,
            'bonds': 30,
            'crypto': 10,
            'reits': 5,
            'cash': 5,
            'rationale': 'Moderate risk with growth focus'
        }

    def _aggressive_strategy(self):
        return {
            'stocks': 65,
            'bonds': 10,
            'crypto': 15,
            'reits': 5,
            'cash': 5,
            'rationale': 'High risk tolerance and volatile markets'
        }

    def update_model(self, X, y):
        """Online learning with new data"""
        self.personal_risk_model.partial_fit(X, y)
        self.explainer = shap.LinearExplainer(self.personal_risk_model.named_steps['model'], 
                                            self.personal_risk_model.named_steps['scaler'].transform(X))

    def explain_strategy(self, user_id):
        """Generate SHAP explanation for strategy"""
        profile = self.user_profiles[user_id]
        features = np.array([
            profile['age'],
            profile['savings_rate'] * 100,
            profile['debt_ratio'] * 100,
            len(profile['income_sources']),
            1 if profile['employed'] else 0
        ]).reshape(1, -1)
        
        scaled_features = self.personal_risk_model.named_steps['scaler'].transform(features)
        shap_values = self.explainer.shap_values(scaled_features)
        
        return {
            'features': ['age', 'savings_rate', 'debt_ratio', 'income_sources', 'employment_status'],
            'shap_values': shap_values[0].tolist()
        }

# Example usage
if __name__ == "__main__":
    optimizer = DynamicStrategyOptimizer()
    
    # Initialize with sample user
    user_id = "user_123"
    optimizer.user_profiles[user_id] = {
        'age': 35,
        'savings_rate': 0.25,
        'debt_ratio': 0.15,
        'income_sources': ['salary', 'dividends'],
        'employed': True
    }
    
    # Initial training data
    X_train = np.array([
        [35, 25, 15, 2, 1],
        [45, 15, 30, 1, 0],
        [28, 30, 10, 3, 1]
    ])
    y_train = np.array([25, 65, 20])
    
    optimizer.update_model(X_train, y_train)
    
    # Get strategy
    strategy = optimizer.update_strategy(user_id)
    explanation = optimizer.explain_strategy(user_id)
    
    print("Recommended Strategy:")
    print(strategy)
    print("\nStrategy Explanation:")
    print(explanation)
    
    # Visualize portfolio
    labels = list(strategy.keys())[:-1]
    sizes = list(strategy.values())[:-1]
    
    plt.pie(sizes, labels=labels, autopct='%1.1f%%')
    plt.title('Portfolio Allocation')
    plt.show()