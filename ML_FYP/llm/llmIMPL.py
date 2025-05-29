from flask import Flask, request, jsonify
import pandas as pd
from Llama import predict_cluster, FinancialAdviceSystem
import numpy as np  # Needed for type conversion
from flask import Flask, request, jsonify
import pandas as pd
import time
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False  # Reduces serialization time
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  
advisor = FinancialAdviceSystem()
@app.route('/generate_strategies', methods=['POST'])
def generate_strategies():
    start_time = time.time()
    try:
        data = request.get_json()

        # Input validation
        required_fields = [
            'are_you_employed', 'job', 'have_vehicle', 'live_alone', 'income',
            'monthly_savings', 'unwanted_spending_alone', 'unwanted_spending_family',
            'basic_needs_alone', 'basic_needs_family', 'people_in_house'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Create DataFrame
        new_user = pd.DataFrame([{
            'Are you employed?': data['are_you_employed'],
            'What is your job?': data['job'],
            'Do you have a vehicle/s?': data['have_vehicle'],
            'Do you live alone and cover your own expenses?': data['live_alone'],
            'What is your personal income?': float(data['income']),
            'How much do you save monthly?': float(data['monthly_savings']),
            'If you live alone... (unwanted spending)': float(data['unwanted_spending_alone']),
            'If you live with family... (unwanted spending)': float(data['unwanted_spending_family']),
            'If you live alone... (basic needs)': float(data['basic_needs_alone']),
            'If you live with family... (basic needs)': float(data['basic_needs_family']),
            'How many people are in your house?': int(data['people_in_house'])
        }])

        cluster_start = time.time()
        cluster, expenses, savings = predict_cluster(new_user)
        print(f"Cluster prediction took: {time.time() - cluster_start:.2f}s")

        strategy_start = time.time()
        income = float(data['income'])
        strategies = advisor.generate_strategies(
            int(cluster),
            income,
            float(expenses),
            float(savings)
        )
        print(f"Strategy generation took: {time.time() - strategy_start:.2f}s")

        print(f"Generated strategies (pre-serialization): {strategies}")
        print(f"Total request processing time: {time.time() - start_time:.2f}s")
        return jsonify({"strategies": strategies})

    except Exception as e:
        print(f"Critical error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
