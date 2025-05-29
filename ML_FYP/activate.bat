@echo off

REM Activate virtual environment
call "C:\Users\dasantha\Desktop\everything\web scraper - Copy\AdviceAI\Advices\adviceProvider\env\Scripts\activate.bat"

REM Run each script in a new command window
start cmd /k python combankScraper\scraper.py
start cmd /k python llm\llmIMPL.py
start cmd /k python newsAPI\newsAPI.py
start cmd /k python sentiment\sentiment_impl.py
start cmd /k python Forecast\forecastimpl.py
start cmd /k python OCR\ocr.py
