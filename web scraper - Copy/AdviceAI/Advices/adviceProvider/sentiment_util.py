import pandas as pd
from datetime import datetime

CATEGORY_MAPPING = {
    "Housing": "housing",
    "Utilities": "utilities",
    "Food (Groceries)": "food_groceries",
    "Healthcare": "healthcare",
    "Transportation": "transportation",
    "Debt": "debt_repayment",
    "Insurance": "insurance",
    "Childcare & Family": "childcare_family",
    "Education": "education",
    "Lifestyle & Discretionary": "lifestyle_and_discretionary",
    "Entertainment": "entertainment",
    "Personal": "personal_expenses",
    "Gifts & Donations": "gifts_and_donations",
    "Miscellaneous": "Miscellaneous"
}

def preprocess_expenses(data):
    df = pd.DataFrame(data)

    # Extract needed fields
    df['date'] = pd.to_datetime(df['date'])
    df['day'] = df['date'].dt.day

    df['category_mapped'] = df['category'].map(CATEGORY_MAPPING).fillna("Miscellaneous")
    
    # Group by day and category
    pivot_df = df.groupby(['day', 'category_mapped'])['amount'].sum().unstack(fill_value=0)

    # Flatten into model's expected format
    max_days = 4
    expected_columns = []
    values = []

    for day in range(1, max_days + 1):
        for cat in CATEGORY_MAPPING.values():
            col_name = f"{cat}_day_{day}"
            expected_columns.append(col_name)
            amount = pivot_df.loc[day][cat] if day in pivot_df.index and cat in pivot_df.columns else 0
            values.append(amount)

    # Return as DataFrame for model
    return pd.DataFrame([values], columns=expected_columns)
