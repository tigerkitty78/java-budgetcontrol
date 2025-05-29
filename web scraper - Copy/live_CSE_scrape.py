from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select, WebDriverWait
import datetime
import pytz
from flask_socketio import SocketIO, emit
import time
import threading
from firebase_admin import credentials, initialize_app, db
import firebase_admin

# Initialize Flask and Socket.IO
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize Firebase
cred = credentials.Certificate("C:\\Users\\dasantha\\Downloads\\stock-market-data-8947e-firebase-adminsdk-fbsvc-ac0cfbbf63.json")  # Ensure this path is correct
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://stock-market-data-8947e-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# Global Firebase reference
ref = db.reference('/cse_data')

def scrape_cse_data():
    """Scrape data from CSE website."""
    utc_now = pytz.utc.localize(datetime.datetime.utcnow())
    today = utc_now.astimezone(pytz.timezone("Asia/Colombo")).strftime('%Y-%m-%d')
    existing_data = ref.order_by_child('Date').equal_to(today).get()
        
    if existing_data:
            print(f"Data for {today} already exists in Firebase. Skipping scrape.")
            return  # 
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")

    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)

    driver.get('https://www.cse.lk/pages/trade-summary/trade-summary.component.html')
    final_select = Select(driver.find_element("name", 'DataTables_Table_0_length'))
    final_select.select_by_visible_text('All')

    WebDriverWait(driver, 3)
    df = pd.read_html(driver.page_source)[0]
    df['Date'] = today


# Check the column names
   

# Sanitize column names
    df.columns = df.columns.str.replace(r'[\$#\[\]\/\.\s]', '_', regex=True)
    print(df.columns)
    driver.quit()
    return df.to_dict(orient='records')
ref_cse = db.reference('/cse_data')
ref_dates = db.reference('/dates')
def background_scraper():
    """Check the 'date' node under cse_data for existing dates."""
    while True:
        try:
            # Get today's date
            utc_now = pytz.utc.localize(datetime.datetime.utcnow())
            today = utc_now.astimezone(pytz.timezone("Asia/Colombo")).strftime('%Y-%m-%d')

            # Check if today exists in cse_data/date
            date_ref = ref.child('date')  # Reference to the date list
            existing_dates = date_ref.get()

            if existing_dates and today in existing_dates:
                print(f"Data for {today} already exists. Skipping scrape.")
                time.sleep(86400)  # 24-hour delay
                continue

            # Scrape new data
            data = scrape_cse_data()
            if not data:
                print("No data scraped.")
                time.sleep(300)
                continue

            # Store data under timestamped key
            timestamp = datetime.datetime.now().isoformat().replace('.', '_')
            ref.child(timestamp).set({
                "data": data
            })

            # Add today to the date list
            if existing_dates:
                updated_dates = existing_dates + [today]
            else:
                updated_dates = [today]
            
            date_ref.set(updated_dates)  # Update the date list

            # Broadcast via WebSocket
            socketio.emit('update', {'data': data, 'date': today})
            print(f"Data for {today} stored successfully.")

        except Exception as e:
            print(f"Error: {str(e)}")

        time.sleep(300)  # Retry every 5 minutes if needed  # Retry every 5 minutes if needed  # Retry every 5 minutes if no data  # Sleep for 5 minutes before next attempt


@app.route('/get_cse_data', methods=['GET'])
def get_cse_data():
    """Endpoint for manual data retrieval."""
    data = scrape_cse_data()
    return jsonify(data)

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connections."""
    print('Client connected')
    emit('status', {'message': 'Connected to live CSE feed'})

if __name__ == '__main__':
    # Start background scraper thread
    threading.Thread(target=background_scraper, daemon=True).start()

    # Run Socket.IO app
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)