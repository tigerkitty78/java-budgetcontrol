import pandas as pd

advice_rules = {
    # saving_bracket <5000
    ('0-4999', '18-25'): [
        "Save for short-term goals (e.g., education, relocation).",
        "Start an emergency fund. Aim for 1-3 months of expenses (even LKR 30,000 can prevent borrowing during crises).",
        "Leverage Community Support: NGOs often provide free meals, school supplies, or medical camps."
    ],
    ('0-4999', '26-35'): [
        "2–3 months a year to ban non-essential purchases.",
        "Buy groceries in bulk with neighbours/friends and split costs—saves on unit price.",
        "Grow a home garden to reduce food costs or collect free seasonal produce (jackfruit, coconuts) from public spaces."
    ],
    ('0-4999', '36-45'): [
        "2–3 months a year to ban non-essential purchases.",
        "Avoid seettu (rotating savings group). If desperate, try with a trusted group",
        "Grow a home garden to reduce food costs or collect free seasonal produce (jackfruit, coconuts) from public spaces."
    ],
    ('0-4999', '46-55'): [
        "Start an emergency fund. Aim for 5–6 months of expenses (even LKR 80,000 can prevent borrowing during crises).",
        "Avoid seettu (rotating savings group). If desperate, try with a trusted group",
        "Buy groceries in bulk with neighbours/friends and split costs—saves on unit price."
    ],
    ('0-4999', '56-65'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Start an emergency fund. Aim for 5–6 months of expenses (even LKR 80,000 can prevent borrowing during crises).",
        "Buy groceries in bulk with neighbours/friends and split costs—saves on unit price."
    ],
    ('0-4999', '66-75'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Start an emergency fund. Aim for 5–6 months of expenses (even LKR 80,000 can prevent borrowing during crises).",
        "Buy groceries in bulk with neighbours/friends and split costs—saves on unit price."
    ],
    ('0-4999', '76-90'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Start an emergency fund. Aim for 5–6 months of expenses (even LKR 80,000 can prevent borrowing during crises).",
        "Buy groceries in bulk with neighbours/friends and split costs—saves on unit price."
    ],

    # saving_bracket 5000-14999
    ('5000-14999', '18-25'): [
        "Save for short-term goals (e.g., education, relocation).",
        "Start an emergency fund. Aim for 1–3 months of expenses (even LKR 50,000 can prevent borrowing during crises).",
        "Repair, don’t replace: Fix appliances/clothing instead of buying new ones."
    ],
    ('5000-14999', '26-35'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Second-hand purchases: Buy refurbished phones/electronics on Kapruka or Facebook Marketplace.",
        "Save to build income diversity (side hustles, freelancing, or overseas jobs)."
    ],
    ('5000-14999', '36-45'): [
        "Grow a home garden to reduce food costs or collect free seasonal produce (jackfruit, coconuts) from public spaces.",
        "Avoid high-interest debt/ loan sharks (common in informal lending).",
        "Save to build income diversity (side hustles, freelancing, or overseas jobs)."
    ],
    ('5000-14999', '46-55'): [
        "Stay active to reduce healthcare costs.",
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Save in senior citizen FDs for higher interest rates."
    ],
    ('5000-14999', '56-65'): [
        "Stay active to reduce healthcare costs.",
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Save in senior citizen FDs for higher interest rates."
    ],
    ('5000-14999', '66-75'): [
        "Stay active to reduce healthcare costs.",
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Save in senior citizen FDs for higher interest rates."
    ],
    ('5000-14999', '76-90'): [
        "Stay active to reduce healthcare costs.",
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Save in senior citizen FDs for higher interest rates."
    ],

    # saving_bracket 15000-29999
    ('15000-29999', '18-25'): [
        "Save for short-term goals (e.g., education, relocation).",
        "Start a retirement fund (EPF/ETF) early for compound growth.",
        "Monetize hobbies (e.g., crafting, tutoring) for extra income and save this income."
    ],
    ('15000-29999', '26-35'): [
        "Save for marriage, children, or housing.",
        "Avoid high-interest debt/ loan sharks (common in informal lending).",
        "Save to build income diversity (side hustles, freelancing, or overseas jobs)."
    ],
    ('15000-29999', '36-45'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Save to prepay mortgages to reduce liabilities.",
        "Save to build income diversity (side hustles, freelancing, or overseas jobs)."
    ],
    ('15000-29999', '46-55'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Start an emergency fund (aim for 1–4 months of expenses)",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies."
    ],
    ('15000-29999', '56-65'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies."
    ],
    ('15000-29999', '66-75'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies."
    ],
    ('15000-29999', '76-90'): [
        "Free public healthcare: Use government clinics to avoid private hospital costs.",
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies."
    ],

    # saving_bracket 30000-59999
    ('30000-59999', '18-25'): [
        "Second-hand purchases: Buy refurbished phones/electronics on Kapruka or Facebook Marketplace.",
        "Save for a degree/ masters (coding, freelancing courses) to boost income long-term.",
        "Start a retirement fund (EPF/ETF) early for compound growth."
    ],
    ('30000-59999', '26-35'): [
        "Save to build income diversity (side hustles, freelancing, or overseas jobs).",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds.",
        "Buy discounted items as much as possible"
    ],
    ('30000-59999', '36-45'): [
        "Second-hand purchases: Buy refurbished phones/electronics on Kapruka or Facebook Marketplace.",
        "Repair, don’t replace: Fix appliances/clothing instead of buying new ones.",
        "Save to prepay mortgages to reduce liabilities."
    ],
    ('30000-59999', '46-55'): [
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Boost retirement contributions",
        "Free public healthcare: Use government clinics to avoid private hospital costs."
    ],
    ('30000-59999', '56-65'): [
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Free public healthcare: Use government clinics to avoid private hospital costs."
    ],
    ('30000-59999', '66-75'): [
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Free public healthcare: Use government clinics to avoid private hospital costs."
    ],
    ('30000-59999', '76-90'): [
        "Shift savings to senior citizen savings schemes (e.g., NSB).",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Free public healthcare: Use government clinics to avoid private hospital costs."
    ],
    # Continue with 60000-99999, 100000-199999, 200000-399999, 400000-799999, >800000...

    # saving_bracket 60000-99999
    ('60000-99999', '18-25'): [
        "Save for a degree/ masters (coding, freelancing courses) to boost income long-term.",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds.",
        "Start a retirement fund (EPF/ETF) early for compound growth."
    ],
    ('60000-99999', '26-35'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Buy discounted items as much as possible",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds."
    ],
    ('60000-99999', '36-45'): [
        "Second-hand purchases: Buy refurbished phones/electronics on Kapruka or Facebook Marketplace.",
        "Grow emergency savings (3–6 months of expenses).",
        "Save to prepay mortgages to reduce liabilities."
    ],
    ('60000-99999', '46-55'): [
        "Boost retirement contributions",
        "Open a low-risk fixed deposit (common in Sri Lankan banks like NSB or commercial banks).",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],
    ('60000-99999', '56-65'): [
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],
    ('60000-99999', '66-75'): [
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],
    ('60000-99999', '76-90'): [
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],

    # saving_bracket 100000-199999
    ('100000-199999', '18-25'): [
        "Save for a degree/ masters (coding, freelancing courses) to boost income long-term.",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds.",
        "Invest in short-term fixed deposits (e.g., HNB or Seylan Bank)."
    ],
    ('100000-199999', '26-35'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Automate savings to avoid lifestyle inflation.",
        "Save to prepay mortgages to reduce liabilities."
    ],
    ('100000-199999', '36-45'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Automate savings to avoid lifestyle inflation.",
        "Allocate 20% to foreign currency FD (USD/EUR)."
    ],
    ('100000-199999', '46-55'): [
        "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
        "Boost retirement contributions",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('100000-199999', '56-65'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    ],
    ('100000-199999', '66-75'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    ],
    ('100000-199999', '76-90'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    ],

    # saving_bracket 200000-399999
    ('200000-399999', '18-25'): [
        "Automate savings to avoid lifestyle inflation.",
        "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds."
    ],
    ('200000-399999', '26-35'): [
        "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
        "Automate savings to avoid lifestyle inflation.",
        "Save to prepay mortgages to reduce liabilities."
    ],
    ('200000-399999', '36-45'): [
        "Grow emergency savings (3–6 months of expenses).",
        "Automate savings to avoid lifestyle inflation.",
        "Allocate 20% to foreign currency FD (USD/EUR)."
    ],
    ('200000-399999', '46-55'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility).",
        "Diversify into Treasury Bonds (low risk, tax-free returns)."
    ],
    ('200000-399999', '56-65'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Diversify into Treasury Bonds (low risk, tax-free returns)."
    ],
    ('200000-399999', '66-75'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Diversify into Treasury Bonds (low risk, tax-free returns)."
    ],
    ('200000-399999', '76-90'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save.",
        "Diversify into Treasury Bonds (low risk, tax-free returns)."
    ],

    # saving_bracket 400000-799999
    ('400000-799999', '18-25'): [
        "Avoid luxury spending: Resist splurging on cars/ clothing",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds."
    ],
    ('400000-799999', '26-35'): [
        "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
        "Automate savings to avoid lifestyle inflation.",
        "Save to prepay mortgages to reduce liabilities."
    ],
    ('400000-799999', '36-45'): [
        "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
        "Save and Set up a trust fund for children’s future.",
        "Diversify into Treasury Bonds (low risk, tax-free returns)."
    ],
    ('400000-799999', '46-55'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('400000-799999', '56-65'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('400000-799999', '66-75'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('400000-799999', '76-90'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],

    # saving_bracket >800000
    ('>800000', '18-25'): [
        "Avoid luxury spending: Resist splurging on cars/ clothing",
        "Automate savings to avoid lifestyle inflation.",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds."
    ],
    ('>800000', '26-35'): [
        "Automate savings to avoid lifestyle inflation.",
        "Avoid luxury spending: Resist splurging on cars/ clothing",
        "Avoid impulsive spending on gadgets; prioritize small emergency funds."
    ],
    ('>800000', '36-45'): [
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility).",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],
    ('>800000', '46-55'): [
        "Automate savings to avoid lifestyle inflation.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility).",
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies."
    ],
    ('>800000', '56-65'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and Set up a trust fund for children’s future.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('>800000', '66-75'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and Set up a trust fund for children’s future.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ],
    ('>800000', '76-90'): [
        "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
        "Save and Set up a trust fund for children’s future.",
        "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    ]
    # ],
    # ('100000-199999', '18-25'): [
    #     "Save for a degree/ masters (coding, freelancing courses) to boost income long-term.",
    #     "Avoid impulsive spending on gadgets; prioritize small emergency funds.",
    #     "Invest in short-term fixed deposits (e.g., HNB or Seylan Bank)."
    # ],
    # ('100000-199999', '26-35'): [
    #     "Grow emergency savings (3–6 months of expenses).",
    #     "Automate savings to avoid lifestyle inflation.",
    #     "Save to prepay mortgages to reduce liabilities."
    # ],
    # ('100000-199999', '36-45'): [
    #     "Grow emergency savings (3–6 months of expenses).",
    #     "Automate savings to avoid lifestyle inflation.",
    #     "Allocate 20% to foreign currency FD (USD/EUR)."
    # ],
    # ('100000-199999', '46-55'): [
    #     "Avoid Luxury spending: Resist splurging on cars/property without ROI.",
    #     "Boost retirement contributions",
    #     "Avoid risky investments and save instead (e.g., stock market due to volatility)."
    # ],
    # ('100000-199999', '56-65'): [
    #     "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
    #     "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
    #     "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    # ],
    # ('100000-199999', '66-75'): [
    #     "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
    #     "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
    #     "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    # ],
    # ('100000-199999', '76-90'): [
    #     "Liquid savings: Keep 6 months’ expenses in a savings account for emergencies.",
    #     "Save and keep 1–2 years of expenses in cash/cash equivalents for emergencies.",
    #     "Downsize lifestyle (sell unused assets, reduce luxury expenses) and use low risk fd to save."
    # ]

}


# Define saving_bracket brackets and age groups
saving_bracket_brackets = [
    (0, 5000, '0-4999'),
    (5001, 15000, '5000-14999'),
    (15001, 30000, '15000-29999'),
    (30001, 60000, '30000-59999'),
    (60001, 100000, '60000-99999'),
    (100001, 200000, '100000-199999'),
    (200001, 400000, '200000-399999'),
    (400001, 800000, '400000-799999'),
    (800001, float('inf'), '>800000')
]

# Age groups
age_groups = [
    (18, 25, '18-25'),
    (26, 35, '26-35'),
    (36, 45, '36-45'),
    (46, 55, '46-55'),
    (56, 65, '56-65'),
    (66, 75, '66-75'),
    (76, 90, '76-90')
]

def get_saving_bracket(saving_amount):
    for min_val, max_val, label in saving_bracket_brackets:
        if min_val <= saving_amount <= max_val:
            return label
    return 'unknown'

def get_age_group(age):
    for min_age, max_age, label in age_groups:
        if min_age <= age <= max_age:
            return label
    return 'unknown'

# Load data
df = pd.read_csv('LATEST GEMBA.csv')

def assign_advice(row):
    saving_amount = row['How much do you save monthly?']
    age = row['Age']
    
    saving_bracket = get_saving_bracket(saving_amount)
    age_group = get_age_group(age)
    
    return advice_rules.get(
        (saving_bracket, age_group), 
        ["General tip: Review your budget monthly.", "", ""]
    )

# Apply advice assignment
df[['Advice 1', 'Advice 2', 'Advice 3']] = df.apply(
    lambda row: pd.Series(assign_advice(row)), 
    axis=1
)

# Save results
df.to_csv('savingsdata_processed.csv', index=False)