import requests
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from collections import defaultdict
from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# API headers
headers = {
    "x-rapidapi-host": "sri-lanka-latest-news.p.rapidapi.com",
    "x-rapidapi-key": "469ed7953fmshbca28574656c473p11abfbjsnc2a758ac6ce9"
}

# News source URLs
urls = {
    "newsfirst": "https://sri-lanka-latest-news.p.rapidapi.com/articles/newsfirst",
    "ft": "https://sri-lanka-latest-news.p.rapidapi.com/articles/ft"
}

# Expanded financial keywords
keywords = [
    "finance", "financial", "business", "economy", "investment",
    "market", "stock", "tariff", "tax", "trade", "gdp", "currency",
    "export", "import", "fiscal", "monetary", "bank", "revenue",
    "debt", "loan", "interest rate", "inflation", "budget"
]

# CSE Listed Companies (Simplified for space - add all from your list)
CSE_COMPANIES = {
    "ABANS ELECTRICALS PLC", "ACCESS ENGINEERING PLC", "ACL CABLES PLC",
    "ACL PLASTICS PLC", "ACME PRINTING & PACKAGING PLC", "AGALAWATTE  PLANTATIONS  PLC",
    "AGSTAR PLC", "AITKEN SPENCE HOTEL HOLDINGS PLC", "AITKEN SPENCE PLC",
    "ALLIANCE FINANCE COMPANY PLC", "ALUMEX PLC", "AMANA BANK PLC", "AMANA TAKAFUL PLC",
    "AMBEON CAPITAL PLC", "AMBEON HOLDINGS PLC", "ASIA ASSET FINANCE PLC", "ASIA CAPITAL PLC",
    "ASIA SIYAKA COMMODITIES LIMITED", "ASIAN HOTELS AND PROPERTIES PLC",
    "ASIRI SURGICAL HOSPITAL PLC", "ASIRI HOSPITAL HOLDINGS PLC",
    "ASSOCIATED MOTOR FINANCE COMPANY PLC", "B P P L HOLDINGS PLC", "BAIRAHA FARMS PLC",
    "BALANGODA  PLANTATIONS  PLC", "BANSEI ROYAL RESORTS HIKKADUWA PLC",
    "BOGALA GRAPHITE LANKA PLC", "BOGAWANTALAWA TEA ESTATES PLC", "BROWN & COMPANY PLC",
    "BROWNS BEACH HOTELS PLC", "BROWNS INVESTMENTS PLC", "BUKIT DARAH PLC", "C M HOLDINGS PLC",
    "C T HOLDINGS PLC", "C T LAND DEVELOPMENT PLC", "C. W. MACKIE PLC", "CAPITAL ALLIANCE PLC",
    "CARGILLS (CEYLON) PLC", "CARGO BOAT DEVELOPMENT COMPANY PLC", "CARSON CUMBERBATCH PLC",
    "CENTRAL FINANCE COMPANY PLC", "CENTRAL INDUSTRIES PLC", "CEYLINCO INSURANCE PLC",
    "CEYLON COLD STORES PLC", "CEYLON GRAIN ELEVATORS PLC",
    "CEYLON GUARDIAN INVESTMENT TRUST PLC", "CEYLON HOSPITALS PLC",
    "CEYLON HOTELS CORPORATION PLC", "CEYLON INVESTMENT PLC", "CEYLON TEA BROKERS PLC",
    "CEYLON TOBACCO COMPANY PLC", "CHEMANEX PLC", "CHEVRON LUBRICANTS  LANKA  PLC",
    "CHRISSWORLD PLC", "C I C HOLDINGS PLC", "CITIZENS DEVELOPMENT BUSINESS FINANCE PLC",
    "CITRUS LEISURE PLC", "Co-operative Insurance Company PLC", "COLOMBO CITY HOLDINGS PLC",
    "COLOMBO DOCKYARD PLC", "COLOMBO FORT INVESTMENTS PLC",
    "COLOMBO LAND AND DEVELOPMENT COMPANY PLC", "COMMERCIAL BANK OF CEYLON PLC",
    "COMMERCIAL CREDIT AND FINANCE PLC", "COMMERCIAL DEVELOPMENT COMPANY PLC",
    "CONVENIENCE FOODS LANKA PLC", "DANKOTUWA PORCELAIN PLC", "DFCC BANK PLC",
    "DIALOG AXIATA PLC", "DIALOG FINANCE PLC", "DIESEL & MOTOR ENGINEERING PLC",
    "DILMAH CEYLON TEA COMPANY PLC", "DIPPED PRODUCTS PLC",
    "DISTILLERIES COMPANY OF SRI LANKA PLC", "DOLPHIN HOTELS PLC",
    "E B CREASY & COMPANY PLC", "E M L CONSULTANTS PLC", "E - CHANNELLING PLC",
    "EAST WEST PROPERTIES PLC", "EASTERN MERCHANTS PLC", "EDEN HOTEL LANKA PLC",
    "ELPITIYA PLANTATIONS PLC", "EQUITY TWO PLC", "Ex-pack Corrugated Cartons PLC",
    "EXPOLANKA HOLDINGS PLC", "EXTERMINATORS PLC", "FIRST CAPITAL HOLDINGS PLC",
    "First Capital Treasuries PLC", "GALADARI HOTELS (LANKA) PLC",
    "GALLE FACE CAPITAL PARTNERS PLC", "GESTETNER OF CEYLON PLC",
    "HAPUGASTENNE PLANTATIONS PLC", "HATTON NATIONAL BANK PLC",
    "HATTON PLANTATIONS PLC", "HAYCARB PLC", "HAYLEYS FABRIC PLC", "HAYLEYS FIBRE PLC",
    "HAYLEYS LEISURE PLC", "HAYLEYS PLC", "HELA APPAREL HOLDINGS PLC", "HEMAS HOLDINGS PLC",
    "HIKKADUWA BEACH RESORT PLC", "HNB ASSURANCE PLC", "HNB FINANCE PLC",
    "HORANA PLANTATIONS PLC", "HOTEL SIGIRIYA PLC",
    "HOUSING DEVELOPMENT FINANCE CORPORATION BANK OF SL", "hSenid Business Solutions PLC",
    "HUNAS HOLDINGS PLC", "HUNTER & COMPANY PLC", "HVA FOODS PLC",
    "INDUSTRIAL ASPHALTS (CEYLON) PLC", "JANASHAKTHI INSURANCE PLC", "JAT HOLDINGS PLC",
    "JETWING SYMPHONY PLC", "JOHN KEELLS HOLDINGS PLC", "JOHN KEELLS HOTELS PLC",
    "JOHN KEELLS PLC", "KAHAWATTE  PLANTATIONS  PLC", "KAPRUKA HOLDINGS PLC",
    "KEELLS FOOD PRODUCTS PLC", "KEGALLE  PLANTATIONS  PLC", "KELANI CABLES PLC",
    "KELANI TYRES PLC", "KELANI VALLEY PLANTATIONS PLC", "KOTAGALA PLANTATIONS PLC",
    "KOTMALE HOLDINGS PLC", "LB FINANCE PLC", "LAKE HOUSE PRINTERS & PUBLISHERS PLC",
    "LANKA ALUMINIUM INDUSTRIES PLC", "LANKA ASHOK LEYLAND PLC",
    "LANKA CREDIT AND BUSINESS FINANCE PLC", "LANKA IOC PLC",
    "LANKA MILK FOODS (CWE) PLC", "LANKA REALTY INVESTMENTS PLC", "LANKA TILES PLC",
    "LANKA VENTURES PLC", "LANKA WALLTILE PLC", "LANKEM CEYLON PLC",
    "LANKEM DEVELOPMENTS PLC", "LAUGFS GAS PLC", "LAUGFS POWER PLC",
    "LAXAPANA BATTERIES PLC", "LION BREWERY (CEYLON) PLC", "LOLC FINANCE PLC",
    "LOLC GENERAL INSURANCE PLC", "L O L C HOLDINGS PLC", "LOTUS HYDRO POWER PLC",
    "LUMINEX PLC", "L V L ENERGY FUND PLC", "MACKWOODS ENERGY PLC",
    "MADULSIMA  PLANTATIONS  PLC", "MAHAWELI COCONUT PLANTATIONS PLC",
    "MAHAWELI REACH HOTELS PLC", "MALWATTE VALLEY PLANTATION PLC",
    "MARAWILA  RESORTS  PLC", "MASKELIYA PLANTATIONS PLC", "MELSTACORP PLC",
    "MERCHANT BANK OF SRI LANKA & FINANCE PLC", "MILLENNIUM HOUSING DEVELOPERS PLC",
    "MULLER & PHIPPS (CEYLON) PLC", "MYLAND DEVELOPMENTS PLC",
    "NAMUNUKULA PLANTATIONS PLC", "NATION LANKA FINANCE PLC",
    "NATIONAL DEVELOPMENT BANK PLC", "NATIONS TRUST BANK PLC",
    "NAWALOKA HOSPITALS PLC", "NESTLE LANKA PLC", "ODEL PLC", "ON'ALLY HOLDINGS PLC",
    "ORIENT FINANCE PLC", "OVERSEAS REALTY (CEYLON) PLC", "PALM GARDEN HOTELS PLC",
    "PAN ASIA BANKING CORPORATION PLC", "PANASIAN POWER PLC",
    "PEGASUS HOTELS OF CEYLON PLC", "PEOPLE'S INSURANCE PLC",
    "PEOPLE'S LEASING & FINANCE PLC", "PGP GLASS CEYLON PLC", "PMF FINANCE PLC",
    "PRIME LANDS RESIDENCIES PLC", "PRINTCARE PLC", "R I L PROPERTY PLC",
    "RADIANT GEMS INTERNATIONAL PLC", "RAIGAM WAYAMBA SALTERNS PLC",
    "RAMBODA FALLS PLC", "REGNIS (LANKA) PLC", "RENUKA AGRI FOODS PLC",
    "RENUKA CITY HOTELS PLC.", "RENUKA FOODS PLC", "RENUKA HOLDINGS PLC",
    "RENUKA HOTELS PLC", "RESUS ENERGY PLC", "RICHARD PIERIS AND COMPANY PLC",
    "RICHARD PIERIS EXPORTS PLC", "ROYAL CERAMICS LANKA PLC",
    "ROYAL PALMS BEACH HOTELS PLC", "SAMPATH BANK PLC", "SAMSON INTERNATIONAL PLC",
    "SANASA DEVELOPMENT BANK PLC", "SARVODAYA DEVELOPMENT FINANCE PLC",
    "SATHOSA MOTORS PLC", "SERENDIB HOTELS PLC", "SERENDIB LAND PLC",
    "SEYLAN BANK PLC", "SEYLAN DEVELOPMENTS PLC", "SHAW WALLACE INVESTMENTS PLC",
    "SIERRA CABLES PLC", "SINGER (SRI LANKA) PLC", "SINGER FINANCE LANKA PLC",
    "SINGER INDUSTRIES (CEYLON) PLC", "SINGHE HOSPITALS PLC", "SMB FINANCE PLC",
    "SOFTLOGIC CAPITAL PLC", "SOFTLOGIC FINANCE PLC", "SOFTLOGIC LIFE INSURANCE PLC",
    "SRI LANKA TELECOM PLC", "STANDARD CAPITAL PLC", "SUNSHINE HOLDINGS PLC",
    "SWISSTEK (CEYLON) PLC", "TAL LANKA HOTELS PLC", "TALAWAKELLE TEA ESTATES PLC",
    "TANGERINE BEACH HOTELS PLC", "TEA SMALLHOLDER FACTORIES PLC", "TEEJAY LANKA PLC",
    "TESS AGRO PLC", "THE COLOMBO FORT LAND AND BUILDING PLC", "THE FORTRESS RESORTS PLC",
    "THE KANDY HOTELS COMPANY (1938) PLC", "THE KINGSBURY PLC",
    "THE LANKA HOSPITALS CORPORATION PLC", "THE  LIGHTHOUSE  HOTEL  PLC",
    "THE NUWARA ELIYA HOTELS COMPANY PLC", "THREE ACRE FARMS PLC",
    "TOKYO CEMENT COMPANY (LANKA) PLC", "TRANS ASIA HOTELS PLC",
    "UDAPUSSELLAWA  PLANTATIONS PLC", "UNION ASSURANCE PLC",
    "UNION BANK OF COLOMBO PLC", "UNION CHEMICALS LANKA PLC", "UNISYST ENGINEERING PLC",
    "UNITED MOTORS LANKA PLC", "VALLIBEL FINANCE PLC", "VALLIBEL ONE PLC",
    "VALLIBEL POWER ERATHNA PLC", "VIDULLANKA PLC", "WASKADUWA BEACH RESORT PLC",
    "WATAWALA  PLANTATIONS  PLC", "WINDFORCE PLC", "YORK ARCADE HOLDINGS PLC"
}

def normalize_company_name(name):
    """Standardize company names for matching"""
    return name.lower().replace(" plc", "").replace(".", "").strip()

# Create normalized set for matching
NORMALIZED_COMPANIES = {normalize_company_name(name): name for name in CSE_COMPANIES}

def summarize_text(text, num_sentences=2):
    """Improved text summarization with error handling"""
    try:
        if len(text.split()) < 50:
            return text.strip() + " [Insufficient content for summary]"
            
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LsaSummarizer()
        summary = summarizer(parser.document, num_sentences)
        return " ".join(str(sentence) for sentence in summary)
    except Exception as e:
        return "Summary not available due to processing error."
COMPANY_STRUCTURE = {
    "SINGER (SRI LANKA) PLC": {
        'core_names': ['singer'],
        'subsidiaries': [
            "SINGER FINANCE LANKA PLC",
            "SINGER INDUSTRIES (CEYLON) PLC"
        ],
        'aliases': ['singer sri lanka', 'singer lanka']
    },
    "JOHN KEELLS HOLDINGS PLC": {
        'core_names': ['john keells'],
        'subsidiaries': [
            "JOHN KEELLS HOTELS PLC",
            "JKH PLC"
        ],
        'aliases': ['jkh', 'john keells group']
    },
    "HATTON NATIONAL BANK PLC": {
        'core_names': ['hatton bank'],
        'aliases': ['hnb'],
        'subsidiaries': [
            "HNB FINANCE PLC",
            "HNB ASSURANCE PLC"
        ]
    },
    "LOLC HOLDINGS PLC": {
        'core_names': ['lolc'],
        'subsidiaries': [
            "LOLC FINANCE PLC",
            "LOLC DEVELOPMENT FINANCE PLC",
            "LOLC GENERAL INSURANCE PLC",
            "LOLC LIFE ASSURANCE PLC",
            "BROWNS INVESTMENTS PLC",
            "BROWN & COMPANY PLC"
        ],
        'aliases': ['lanka orix', 'lolc group']
    },
    "CEYLON GRAIN ELEVATORS PLC": {
        'core_names': ['ceylon grain elevators'],
        'subsidiaries': [
            "THREE ACRE FARMS PLC",
            "CEYLON LIVESTOCK AND AGRO-BUSINESS SERVICES (PVT) LTD",
            "CEYLON WAREHOUSE COMPLEX (PVT) LTD"
        ],
        'aliases': ['cge', 'grain elevators']
    },
    "HAYLEYS PLC": {
        'core_names': ['hayleys'],
        'subsidiaries': [
            "HAYCARB PLC",
            "HAYLEYS FABRIC PLC",
            "HAYLEYS FIBRE PLC",
            "HAYLEYS LEISURE PLC"
        ],
        'aliases': ['hayleys group']
    },
    "HEMAS HOLDINGS PLC": {
        'core_names': ['hemas'],
        'subsidiaries': [
            "HEMAS CAPITAL HOSPITALS PLC",
            "HEMAS MANUFACTURING (PVT) LTD",
            "HEMAS PHARMACEUTICALS (PVT) LTD"
        ],
        'aliases': ['hemas group']
    },
    "DIALOG AXIATA PLC": {
        'core_names': ['dialog'],
        'subsidiaries': [
            "DIALOG BROADBAND NETWORKS (PVT) LTD",
            "DIALOG TELEVISION (PVT) LTD"
        ],
        'aliases': ['dialog telecom']
    },
    "COMMERCIAL BANK OF CEYLON PLC": {
        'core_names': ['commercial bank'],
        'subsidiaries': [
            "COMMERCIAL DEVELOPMENT COMPANY PLC"
        ],
        'aliases': ['combank']
    },
    "NATIONAL DEVELOPMENT BANK PLC": {
        'core_names': ['national development bank'],
        'subsidiaries': [
            "NDB INVESTMENT BANK LTD",
            "NDB WEALTH MANAGEMENT LTD"
        ],
        'aliases': ['ndb']
    }
    # Additional companies can be added here following the same structure.
}


def normalize_company_name(text):
    """Advanced normalization for company names"""
    text = text.lower()
    # Remove common corporate designations
    removals = ['plc', 'ltd', 'holding', 'group', 'company', 
                'corporation', '&', 'sri lanka', 'ceylon']
    for r in removals:
        text = text.replace(r, '')
    # Remove special characters and whitespace
    return ''.join(e for e in text if e.isalnum())

def get_parent_company(company_name):
    """Identify parent company for subsidiaries"""
    normalized = normalize_company_name(company_name)
    for parent, data in COMPANY_STRUCTURE.items():
        # Check parent core names
        if any(normalize_company_name(cn) in normalized 
               for cn in data['core_names']):
            return parent
        # Check subsidiaries
        for sub in data.get('subsidiaries', []):
            if normalize_company_name(sub) in normalized:
                return parent
    return company_name  # Return original if no parent found

# Updated CSE_COMPANIES list (main parent companies)
CSE_COMPANIES = list(COMPANY_STRUCTURE.keys())

def analyze_company_mentions(content):
    """Comprehensive company mention analysis"""
    mentions = defaultdict(int)
    normalized_content = normalize_company_name(content)
    
    # Check all possible company references
    for company in COMPANY_STRUCTURE:
        # Check parent company names
        parent_norm = normalize_company_name(company)
        if parent_norm in normalized_content:
            mentions[company] += 3  # Higher weight for direct mentions
            
        # Check aliases and abbreviations
        for alias in COMPANY_STRUCTURE[company].get('aliases', []):
            if normalize_company_name(alias) in normalized_content:
                mentions[company] += 2
                
        # Check subsidiaries
        for sub in COMPANY_STRUCTURE[company].get('subsidiaries', []):
            sub_norm = normalize_company_name(sub)
            if sub_norm in normalized_content:
                mentions[company] += 1

    return mentions

# Update the generate_insights function
# def generate_insights(articles):
#     insights = defaultdict(list)
#     company_mentions = defaultdict(int)

#     for article in articles:
#         content = article['content'].lower()
#         # Get all company mentions with weights
#         article_mentions = analyze_company_mentions(content)
        
#         # Aggregate mentions
#         for company, count in article_mentions.items():
#             parent = get_parent_company(company)
#             company_mentions[parent] += count

def generate_insights(articles):
    """Generate market insights from collected articles"""
    insights = defaultdict(list)
    sector_keywords = {
        'textile': ['apparel', 'textile', 'garment'],
        'tea': ['tea', 'plantation', 'agriculture'],
        'automotive': ['vehicle', 'auto', 'three-wheeler'],
        'construction': ['architecture', 'design', 'construction'],
        'technology': ['outsourcing', 'IT', 'technology']
    }
    company_mentions = defaultdict(int)

    for article in articles:
        content = article['content'].lower()
        # Get all company mentions with weights
        article_mentions = analyze_company_mentions(content)
        
        # Aggregate mentions
        for company, count in article_mentions.items():
            parent = get_parent_company(company)
            company_mentions[parent] += count
        
        # Government policy detection
        if any(word in content for word in ['government', 'minister', 'policy', 'regulation']):
            insights['policy_mentions'].append(1)
            
        # Partnership detection
        if 'partner' in content or 'collaborate' in content:
            insights['partnerships'].append(article['title'])

        # Company mention analysis
        found_companies = set()
        for norm_name, original_name in NORMALIZED_COMPANIES.items():
            if norm_name in content:
                found_companies.add(original_name)
        
        # Additional check for common abbreviations
        if 'hnb' in content and 'HATTON NATIONAL BANK PLC' not in found_companies:
            found_companies.add('HATTON NATIONAL BANK PLC')
        if 'jkhl' in content and 'JOHN KEELLS HOLDINGS PLC' not in found_companies:
            found_companies.add('JOHN KEELLS HOLDINGS PLC')
        
        for company in found_companies:
            company_mentions[company] += 1

    # Format insights
    insight_report = ["💡 Key Market Insights:"]
    
    if insights['sector_activity']:
        sector_counts = {s: insights['sector_activity'].count(s) for s in set(insights['sector_activity'])}
        insight_report.append(f"\n📊 Sector Activity: Most mentions in {', '.join([f'{k} ({v})' for k, v in sector_counts.items()])}")
    
    if len(insights.get('policy_mentions', [])) > 0:
        insight_report.append(f"\n🏛️ Policy Impact: {len(insights['policy_mentions'])} articles mention government policy changes")
    
    if insights['partnerships']:
        insight_report.append(f"\n🤝 Strategic Partnerships: {len(insights['partnerships'])} new collaborations reported")
    
    if company_mentions:
        top_companies = sorted(company_mentions.items(), key=lambda x: x[1], reverse=True)[:5]
        insight_report.append("\n📈 Top Mentioned CSE Companies:")
        for company, count in top_companies:
            insight_report.append(f"  🏢 {company}")
            insight_report.append(f"    • Mentions: {count}")
            if count > 2:
                insight_report.append("    • Potential Impact: High - Consider detailed analysis")
            elif count > 0:
                insight_report.append("    • Potential Impact: Moderate - Monitor developments")

    return "\n".join(insight_report) if len(insight_report) > 1 else "No significant insights identified"

def fetch_and_filter_news(source_name, url):
    print(f"\n🔍 Checking {source_name.upper()} for financial-related news...")
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print(f"Failed to fetch {source_name} news. Status code: {response.status_code}")
        return []

    news = response.json()
    filtered_news = []
    seen_titles = set()

    for article in news:
        title = article.get("title", "").strip()
        content = (article.get("content") or article.get("description") or "").strip()
        url_path = article.get("url", "").strip()

        normalized_title = title.lower().strip()
        if normalized_title in seen_titles:
            continue
        seen_titles.add(normalized_title)

        combined_text = f"{title} {content}".lower()
        
        if any(keyword in combined_text for keyword in keywords):
            full_content = f"{title}\n\n{content}"
            filtered_news.append({
                "title": title,
                "url": url_path,
                "source": article.get("source", source_name),
                "content": full_content
            })

    if filtered_news:
        print(f"\n📰 {len(filtered_news)} Financial/Business News Articles from {source_name.upper()}:\n" + "-"*60)
        for article in filtered_news:
            print(f"Title: {article['title']}")
            print(f"URL: {article['url']}")
            print(f"Source: {article['source']}")
            print("🔎 Summary:")
            print(summarize_text(article["content"]))
            print("-" * 60)
    else:
        print(f"No matching financial/business articles found from {source_name.upper()}.")

    return filtered_news

if __name__ == "__main__":
    all_articles = []
    for source, url in urls.items():
        all_articles += fetch_and_filter_news(source, url)
    
    if all_articles:
        print("\n" + generate_insights(all_articles))
    else:
        print("\n⚠️ No financial news found for insights generation")


@app.route('/analyze_cse_mentions', methods=['GET'])
def analyze_mentions_endpoint():
    all_articles = []
    for source, url in urls.items():
        articles = fetch_and_filter_news(source, url)
        all_articles.extend(articles)

    if not all_articles:
        return jsonify({'status': 'error', 'message': 'No articles found'}), 404

    insights = generate_insights(all_articles)
    return jsonify({'status': 'success', 'data': insights})


# ----------------- RUN APP -----------------

if __name__ == '__main__':
       app.run(debug=True, port=5002)