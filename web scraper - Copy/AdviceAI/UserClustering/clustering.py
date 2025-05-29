import pandas as pd
import numpy as np
from kmodes.kprototypes import KPrototypes
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import joblib

# Load data
df = pd.read_csv('C:/Users/dasantha/Desktop/everything/web scraper/AdviceAI/UserClustering/fypdata.csv')
print("Script is running...")

# Define categorical columns
categorical_cols = [
    'Are you employed?', 
    'What is your job?',
    'What categories of income do you currently have?',
    'Do you have a vehicle/s?',
    'Do you live alone and cover your own expenses?'
]

# Preprocessing function
def preprocess(df):
    binary_map = {'Yes': 1, 'No': 0}
    df['Are you employed?'] = df['Are you employed?'].map(binary_map)
    df['Do you have a vehicle/s?'] = df['Do you have a vehicle/s?'].map(binary_map)
    df['Do you live alone and cover your own expenses?'] = df['Do you live alone and cover your own expenses?'].map(binary_map)
    
    for col in categorical_cols:
        df[col] = df[col].astype(str)
    
    # Convert columns to numeric
    df['What is your personal income?'] = pd.to_numeric(df['What is your personal income?'], errors='coerce')
    df['How much do you save monthly?'] = pd.to_numeric(df['How much do you save monthly?'], errors='coerce')
    df['What is your total household income?'] = pd.to_numeric(df['What is your total household income?'], errors='coerce')
    df['How many people are in your house?'] = pd.to_numeric(df['How many people are in your house?'], errors='coerce')
    
    df['unwanted_spending'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 1,
        df['If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly'],
        df['If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly']
    )
    
    df['basic_needs'] = np.where(
        df['Do you live alone and cover your own expenses?'] == 1,
        df['If you live alone, How much do you spend on basic needs monthly?'],
        df['If you live with family How much do you spend on basic needs monthly?']
    )
    
    df = df.drop(columns=[
        'If you live alone, How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live alone, How much do you spend on basic needs monthly?',
        'If you live with family How much do you spend for unwanted things (entertainment/snacks/leisure ) monthly',
        'If you live with family How much do you spend on basic needs monthly?'
    ])
    
    df['unwanted_spending'] = pd.to_numeric(df['unwanted_spending'], errors='coerce')
    df['basic_needs'] = pd.to_numeric(df['basic_needs'], errors='coerce')

    df['savings_ratio'] = df['How much do you save monthly?'] / df['What is your personal income?']
    df['wants_needs_ratio'] = df['unwanted_spending'] / df['basic_needs']
    
    # Calculate household income per capita and wealth indicator if total household income exists
    if 'What is your total household income?' in df.columns:
        df['household_income_per_capita'] = np.where(
            df['Do you live alone and cover your own expenses?'] == 0,  # If living with others
            df['What is your total household income?'] / df['How many people are in your house?'],
            df['What is your personal income?']  # If living alone, use personal income 
        )
        # For users not living alone, compute a weighted wealth indicator;
        # for those living alone, wealth indicator equals personal income.
        df['wealth_indicator'] = np.where(
            df['Do you live alone and cover your own expenses?'] == 0,
            0.7 * df['household_income_per_capita'] + 0.3 * df['What is your personal income?'],
            df['What is your personal income?']
        )
    
    df.fillna(0, inplace=True)
    return df

# Clean data
df_clean = preprocess(df)

# Select features for clustering (added wealth_indicator)
cluster_features = [
    'Are you employed?', 'What is your job?', 'Do you have a vehicle/s?',
    'What is your personal income?', 'savings_ratio', 'wants_needs_ratio', 
    'How many people are in your house?', 'wealth_indicator'
]

# Define categorical indices (positions of categorical features)
categorical_indices = [0, 1, 2]

data = df_clean[cluster_features]

# Scale numerical features (include wealth_indicator)
numerical_cols = ['What is your personal income?', 'savings_ratio', 'wants_needs_ratio', 'How many people are in your house?', 'wealth_indicator']
data.loc[:, numerical_cols] = StandardScaler().fit_transform(data[numerical_cols])

# Apply PCA on numerical features
pca = PCA(n_components=2)  # Reduce numerical features to 2 components
numerical_pca = pca.fit_transform(data[numerical_cols])

# Combine transformed numerical features with categorical data
categorical_data = data.iloc[:, categorical_indices].values
data_matrix_pca = np.hstack((categorical_data, numerical_pca))

# Find optimal clusters using the elbow method
costs = []
for k in range(2, 6):
    kproto = KPrototypes(n_clusters=k, init='Cao', verbose=2)
    clusters = kproto.fit_predict(data_matrix_pca, categorical=categorical_indices)
    costs.append(kproto.cost_)

# Plot elbow graph
plt.plot(range(2, 6), costs)
plt.xlabel('Number of clusters')
plt.ylabel('Cost')
plt.title('Elbow Method for Optimal K')
plt.show()

# Choose optimal k (adjust based on elbow plot)
optimal_k = 6  
kproto = KPrototypes(n_clusters=optimal_k, init='Cao')
clusters = kproto.fit_predict(data_matrix_pca, categorical=categorical_indices)

df_clean['cluster'] = clusters

# Visualize clusters in PCA space
plt.figure(figsize=(8, 6))
plt.scatter(numerical_pca[:, 0], numerical_pca[:, 1], c=df_clean['cluster'], cmap='viridis', s=50)
plt.xlabel('PCA Component 1')
plt.ylabel('PCA Component 2')
plt.title('2D Cluster Visualization in PCA Space')
plt.colorbar(label='Cluster')
plt.show()

# Analyze clusters
cluster_profile = df_clean.groupby('cluster').agg({
    'What is your personal income?': 'mean',
    'savings_ratio': 'mean',
    'wants_needs_ratio': 'mean',
    'How many people are in your house?': 'mean',
    'wealth_indicator': 'mean',
    'What is your job?': lambda x: x.mode()[0],
}).reset_index()

print(cluster_profile)

# Save models
# joblib.dump(kproto, 'kproto_model.pkl')
# joblib.dump(scaler, 'scaler.pkl')
# joblib.dump(pca, 'pca_model.pkl')



















