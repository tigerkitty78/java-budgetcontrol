import pandas as pd
import numpy as np
import joblib

# Load saved models: K-Prototypes, Scaler, and PCA
kproto = joblib.load('kproto_model.pkl')
scaler = joblib.load('scaler.pkl')
pca = joblib.load('pca_model.pkl')  # PCA was fitted on 4 numerical features (without wealth_indicator)

def preprocess_new_data(new_user_df):
    """Preprocess new user data to match clustering model requirements."""
    binary_map = {'Yes': 1, 'No': 0}
    
    # Convert categorical binary fields using .loc to avoid SettingWithCopyWarning
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

    # Create derived financial ratios (handling division by zero)
    new_user_df['savings_ratio'] = new_user_df['How much do you save monthly?'] / new_user_df['What is your personal income?']
    new_user_df['wants_needs_ratio'] = new_user_df['unwanted_spending'] / new_user_df['basic_needs']
    
    # Compute wealth indicator.
    # For new users (without household income data), default to personal income.
    new_user_df['wealth_indicator'] = new_user_df['What is your personal income?']
    
    # Replace NaNs (e.g., division by zero) with 0
    new_user_df.fillna(0, inplace=True)

    # Select final feature set in the same order as used during training.
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
    
    return new_user_df[cluster_features]

def predict_cluster(new_user_df):
    """Predict cluster for new user data using the same transformations as training."""
    # Preprocess new user data
    processed_data = preprocess_new_data(new_user_df)
    
    # Define numerical features that were used for scaling (all 5 features)
    numerical_cols = [
        'What is your personal income?', 
        'savings_ratio', 
        'wants_needs_ratio', 
        'How many people are in your house?', 
        'wealth_indicator'
    ]
    
    # Scale all 5 numerical features using the saved scaler
    scaled_numerical = scaler.transform(processed_data.loc[:, numerical_cols])
    
    # For PCA, we only need the first 4 features (since PCA was fitted on those)
    scaled_numerical_for_pca = scaled_numerical[:, :4]
    
    # Apply the saved PCA transformation (which reduces 4 features to 2 components)
    numerical_pca = pca.transform(scaled_numerical_for_pca)
    
    # Extract categorical data (first 3 columns)
    categorical_data = processed_data.iloc[:, [0, 1, 2]].to_numpy()
    
    # Combine categorical data with the 2 PCA components to form a 5-column matrix
    data_matrix = np.hstack((categorical_data, numerical_pca))
    
    # Define categorical indexes (positions 0, 1, and 2 remain categorical)
    categorical_indexes = [0, 1, 2]
    
    # Predict cluster using the K-Prototypes model
    cluster = kproto.predict(data_matrix, categorical=categorical_indexes)[0]  # [0] for a single user

    return cluster

def get_advice(cluster):
    """Return financial advice based on cluster."""
    advice = {
        0: "Invest 80% of savings in low-risk bonds. Review estate planning.",
        1: "Automate 5% more savings monthly. Explore freelance opportunities.",
        2: "Diversify investments: 60% stocks, 30% bonds, 10% crypto.",
        3: "Refinance mortgage. Use 529 plans for education savings.",
        4: "Cancel 2 subscriptions. Use cash envelopes for dining out.",
        5: "Apply for SNAP benefits. Visit food banks weekly."
    }
    return advice.get(cluster, "Track expenses daily using our app.")

# Example: New user input (ensure all required columns for preprocessing are provided)
new_user = pd.DataFrame([{
    'Are you employed?': 'Yes',
    'What is your job?': 'Teacher',
    'Do you have a vehicle/s?': 'No',
    'Do you live alone and cover your own expenses?': 'Yes',
    'What is your personal income?': 65000,
    'How much do you save monthly?': 5000,
    'If you live alone... (unwanted spending)': 1000,
    'If you live with family... (unwanted spending)': 0,   # Provided for logic consistency
    'If you live alone... (basic needs)': 2000,
    'If you live with family... (basic needs)': 0,         # Provided for logic consistency
    'How many people are in your house?': 3
}])

# Predict cluster for the new user
cluster = predict_cluster(new_user)

# Get corresponding advice
print(f"Cluster: {cluster}, Advice: {get_advice(cluster)}")






