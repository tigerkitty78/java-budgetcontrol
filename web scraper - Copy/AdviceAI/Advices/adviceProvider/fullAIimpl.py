from flask import Flask, request, jsonify
import pandas as pd
import joblib
from financial_models import FinancialAdvisorModels

app = Flask(__name__)
models = FinancialAdvisorModels()

# Load models at startup
@app.before_first_request
def load_models():
    model_names = ['WMI', 'FRF', 'DSE', 'CFH']
    for name in model_names:
        models.models[name] = joblib.load(f'models/{name.lower()}_model.pkl')

@app.route('/predict/all', methods=['POST'])
def predict_all():
    try:
        data = request.json
        input_df = pd.DataFrame([data])
        
        # Preprocess input
        processed_df = models._calculate_complex_targets(input_df)
        
        # Make predictions
        predictions = {}
        for target_name, model in models.models.items():
            X = processed_df[models.features]
            predictions[target_name] = float(model.predict(X)[0])
            
        return jsonify({
            'status': 'success',
            'predictions': predictions,
            'advice': generate_advice(predictions)
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def generate_advice(predictions):
    # Implement your advice generation logic here
    advice = {
        'WMI': f"Wealth Momentum Index: {predictions['WMI']:.2f} - ",
        'FRF': f"Financial Resilience Factor: {predictions['FRF']:.2f} - ",
        'DSE': f"Spending Efficiency: {predictions['DSE']:.2f} - ",
        'CFH': f"Financial Health: {predictions['CFH']:.2f} - "
    }
    return advice

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)