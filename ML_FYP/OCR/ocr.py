from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract
import re
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Memory store (optional: use DB instead)
extracted_data_store = {}

def extract_text_from_image(image_path):
    with Image.open(image_path) as img:
        return pytesseract.image_to_string(img)

def parse_receipt(text):
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    result = {'supermarket': 'Unknown', 'gross_total': None}
    if lines:
        result['supermarket'] = lines[0]
    if len(lines) >= 2:
        match = re.search(r'([\d,]+\.\d{2})', lines[-2])
        if match:
            try:
                result['gross_total'] = float(match.group(1).replace(',', ''))
            except ValueError:
                pass
    return result

@app.route('/api/scan-receipt', methods=['POST'])
def scan_receipt():
    if 'receipt' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['receipt']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    text = extract_text_from_image(filepath)
    data = parse_receipt(text)

    # Save result temporarily
    extracted_data_store['last_receipt'] = data
    os.remove(filepath)

    return jsonify(data)

@app.route('/api/last-receipt', methods=['GET'])
def get_last_receipt():
    data = extracted_data_store.get('last_receipt', {})
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5005)
