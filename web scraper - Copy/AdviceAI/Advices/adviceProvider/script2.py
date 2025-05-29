import pandas as pd
import random
import hashlib
import numpy as np
from datetime import datetime

# Initialize advice lists first for better memory management
recommended_advice = [...]  # Your 20 items
alternative_advice = [...]  # Your 20 items
avoid_advice = [...]        # Your 20 items

prohibited_pairs = {
    "Invest in Gold Bonds": ["Try Crypto ETFs"],
    "Start SIP": ["Avoid High-Risk Derivatives"],
    "Conservative Hybrid Funds": ["Try Crowdfunding Platforms"]
}

def chaos_hash(row):
    """Optimized hash function with reduced complexity"""
    return int(
        hashlib.shake_256(
            f"{row['What is your job?']}{row['Age']}{random.getrandbits(64)}".encode()
        ).hexdigest(6),  # Reduced digest size
        16
    )

def quantum_shuffle(lst, seed):
    """Faster shuffle with NumPy"""
    np.random.seed(seed)
    return list(np.random.permutation(lst))

def get_advice(row):
    """Optimized advice generator"""
    try:
        base_seed = chaos_hash(row)
        
        # Pre-calculate list lengths
        rec_len = len(recommended_advice)
        alt_len = len(alternative_advice)
        avoid_len = len(avoid_advice)
        
        # Vectorized index calculation
        idx = (
            abs(np.sin(base_seed % 1000)) * rec_len,
            abs(np.cos(base_seed % 1000)) * alt_len,
            abs(np.tan(base_seed % 1000)) * avoid_len
        )
        
        rec_idx = int(idx[0]) % rec_len
        alt_idx = int(idx[1]) % alt_len
        avoid_idx = int(idx[2]) % avoid_len
        
        # Direct conflict check without loop
        rec = recommended_advice[rec_idx]
        avoid = avoid_advice[avoid_idx]
        
        if avoid in prohibited_pairs.get(rec, []):
            avoid_idx = (avoid_idx + 1) % avoid_len
            
        return pd.Series({
            "savings_advice_1": rec,
            "savings_advice_2": alternative_advice[alt_idx],
            "savings_advice_avoid": avoid_advice[avoid_idx]
        })
    
    except Exception as e:
        print(f"Error processing row {row.name}: {str(e)}")
        return pd.Series({
            "savings_advice_1": "Diversify with Mutual Funds",
            "savings_advice_2": "Start ESG savings",
            "savings_advice_avoid": "Avoid High-Risk Derivatives"
        })

# Load data
df = pd.read_csv('LATEST GEMBA.csv')
df.columns = df.columns.str.strip()

# Define 20 unique advice options for each category
recommended_advice = [
    "Diversify with Mutual Funds", "Start SIP (Systematic savings Plan)", "Invest in Index Funds",
    "Consider Pension Schemes", "Start Emergency Fund", "Invest in Gold Bonds", "Open High-Yield Savings Account",
    "Use Budgeting Tools", "Explore PPF/NSB Smart Saver", "Buy Treasury Bonds",
    "Real Estate (small plots)", "Invest in Blue Chip Stocks", "Invest in Unit Trusts",
    "Use Tax-Efficient Accounts", "Contribute to Retirement Fund", "Open a Forex Account",
    "Invest in REITs", "Buy ETFs", "Conservative Hybrid Funds", "Invest in Corporate Bonds"
]

alternative_advice = [
    "Try Crypto ETFs", "Start Robo-Advisory savings", "Peer-to-Peer Lending", "Invest in Collectibles",
    "Explore Structured Products", "Open Dollar Account", "Explore Foreign Stocks",
    "Diversify with Islamic Finance", "Start ESG savings", "Use AI-based Portfolio Managers",
    "Real Estate Trusts", "Green Bonds", "Balanced Mutual Funds", "Stock Options Learning",
    "Start Freelancing for Side Income", "Participate in Micro Investing", "Try Crowdfunding Platforms",
    "Dividend-paying Stocks", "Precious Metal Mutual Funds", "Try Automated Saving Apps"
]

avoid_advice = [
    "Avoid High Leverage", "Avoid Unregulated savingss", "Avoid Investing Without Emergency Fund",
    "Don't Ignore Inflation", "Avoid Crypto Without Research", "Avoid Ponzi Schemes",
    "Avoid Overlapping Insurance-savingss", "Don't Skip Retirement Planning",
    "Avoid Non-Diversified Portfolios", "Avoid High-Risk Derivatives",
    "Don't Invest on Borrowed Money", "Avoid Frequent Trading", "Avoid Overexposure to One Sector",
    "Avoid Emotion-Driven Decisions", "Avoid Timing the Market", "Avoid Ignoring Fees",
    "Don't Chase Unrealistic Returns", "Avoid Ignoring Tax Implications", "Avoid Undocumented Assets",
    "Don't Trust Unlicensed Advisors"
]

# Process in chunks for large datasets
chunk_size = 1000
results = []

for chunk in np.array_split(df, len(df) // chunk_size + 1):
    chunk_advice = chunk.apply(get_advice, axis=1)
    results.append(pd.concat([chunk, chunk_advice], axis=1))

df = pd.concat(results)

# Save results
df.to_csv("optimized_advice_output.csv", index=False)
print("Processing completed successfully!")