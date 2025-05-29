# Activate the virtual environment
source "/c/Users/dasantha/Desktop/everything/web scraper - Copy/AdviceAI/Advices/adviceProvider/env/Scripts/activate"

# Run all scripts in parallel and log output/errors
python "combankScraper/scraper.py" > combank.log 2>&1 &
python "llm/llmIMPL.py" > llm.log 2>&1 &
python "newsAPI/newsAPI.py" > newsAPI.log 2>&1 &
python "sentiment/sentiment_impl.py" > sentiment.log 2>&1 &
# python "Forecast/forecastimpl.py" > forecast.log 2>&1 &