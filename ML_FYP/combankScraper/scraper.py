import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/scrape', methods=['GET'])
def scrape_data():
    # The URL you want to scrape
    url = "https://www.combank.lk/rates-tariff"
    
    # Fetch the page content
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Locate all tables and preceding <a class="expand-link"> elements
        sections = []
        expand_links = soup.find_all('a', class_='expand-link')
        tables = soup.find_all('table')

        # Ensure that we associate each table with its preceding expand link
        min_length = min(len(expand_links), len(tables))
        for i in range(min_length):
            expand_text = expand_links[i].text.strip()  # Get the text from <a class="expand-link">
            print(f"Expand link {i+1} text:", expand_text)  # Print expand link text
            
            table = tables[i]

            # Extract table headers (if any)
            headers = []
            header_row = table.find('tr')
            if header_row:
                header_cells = header_row.find_all('th')
                headers = [header.text.strip() for header in header_cells]
            
            # Find all rows in the table (skip the first row if it contains headers)
            rows = table.find_all('tr')[1:]  
            
            table_data = []  # List to store data for the current table
            
            # Loop through each row and get the table cell values
            for row in rows:
                cols = row.find_all('td')
                if len(cols) > 0:
                    data = [col.text.strip() for col in cols]
                    table_data.append(data)
            
            # Store the expand link text and corresponding table data together
            sections.append({
                "expand_link": expand_text,
                "table": {
                    "headers": headers,
                    "data": table_data
                }
            })

        # Return the scraped data as JSON
        return jsonify(sections)
    
    else:
        return jsonify({"error": "Failed to retrieve the page."}), 500

if __name__ == '__main__':
    app.run(debug=True)

