import time
import os
import schedule
import sqlite3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from inference_sdk import InferenceHTTPClient

# === CONFIG ===
ASSETS = [
    {"symbol": "BINANCE:BTCUSD", "name": "BTC", "url": 
"https://www.tradingview.com/chart/?symbol=BINANCE%3ABTCUSD"},
    {"symbol": "BINANCE:ETHUSD", "name": "ETH", "url": 
"https://www.tradingview.com/chart/?symbol=BINANCE%3AETHUSD"},
    {"symbol": "BINANCE:XRPUSD", "name": "XRP", "url": 
"https://www.tradingview.com/chart/?symbol=BINANCE%3AXRPUSD"},
]
CHROME_DRIVER_PATH = "/path/to/chromedriver"
SCREENSHOT_PATH = "tv_chart.png"
DB_PATH = "signals.db"
API_KEY = "please-enter-roboflow-api-key"
MODEL_ID = "slinky-crypto-ai-technical-analyst/1"
TARGET_PATTERNS = ["cup and handle", "channel", "double-bottom", "flag", 
"resistance", "triangle"]


def setup_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS signals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            asset TEXT,
            pattern TEXT,
            entry REAL,
            sl REAL,
            tp1 REAL,
            tp2 REAL,
            confidence REAL,
            detected_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def insert_signal(asset, pattern, entry, sl, tp1, tp2, confidence):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO signals (asset, pattern, entry, sl, tp1, tp2, 
confidence) VALUES (?, ?, ?, ?, ?, ?, ?)",
               (asset, pattern, entry, sl, tp1, tp2, confidence))
    conn.commit()
    conn.close()

def get_price_range_from_dom(driver):
    """
    Scrape all visible Y-axis (price) labels and infer min/max.
    Returns (price_top, price_bottom)
    """
    time.sleep(5)  # Wait just in case chart is rendering
    price_texts = []

    # Try a few approaches for TradingView Y-axis price labels
    axis_labels = driver.find_elements(By.CSS_SELECTOR, 
'[data-name="y-axis-label"]')
    if not axis_labels:  # fallback
        axis_labels = driver.find_elements(By.CSS_SELECTOR, 
'.tv-value-axis__label')

    for lbl in axis_labels:
        try:
            text = lbl.text.replace(",", "").replace("$", "")
            price = float(text)
            price_texts.append(price)
        except Exception:
            continue

    if not price_texts:
        print("No Y-axis labels found, check selector or manually set 
range.")
        raise RuntimeError("No price axis data found.")

    return (max(price_texts), min(price_texts))

def screenshot_and_detect(asset):
    service = Service(CHROME_DRIVER_PATH)
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--window-size=1200,800')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(service=service, options=options)

    driver.get(asset["url"])
    print(f"Loading chart for {asset['name']}...")
    time.sleep(15)  # Wait for chart to load more reliably

    # --- Auto Y-axis scraping
    price_top, price_bottom = get_price_range_from_dom(driver)
    img_height = 800  # must match --window-size above

    # --- Screenshot
    driver.save_screenshot(SCREENSHOT_PATH)
    driver.quit()
    print(f"Screenshot for {asset['name']} saved.")

    # --- Detection
    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=API_KEY
    )
    print(f"Sending {asset['name']} to inference API...")
    result = client.infer(SCREENSHOT_PATH, model_id=MODEL_ID)
    print(result)

    # --- Signal Processing/DB Insert
    for pred in result["predictions"]:
        pattern = pred['class'].lower().strip()
        if pattern in TARGET_PATTERNS:
            signal = get_signal_from_detection(pred, img_height, 
price_top, price_bottom)
            if signal:
                insert_signal(
                    asset['symbol'],
                    signal['pattern'],
                    signal['entry'],
                    signal['sl'],
                    signal['tp1'],
                    signal['tp2'],
                    signal['confidence']
                )
                print(f"{asset['name']}: Inserted signal: {signal}")

    os.remove(SCREENSHOT_PATH)  # Clean up

def pixel_to_price(y_pixel, img_height, price_top, price_bottom):
    return price_top - ((price_top - price_bottom) * y_pixel / img_height)

def get_signal_from_detection(pred, img_height, price_top, price_bottom, 
rr1=1.5, rr2=2.0):
    pattern = pred['class'].lower()
    conf = pred['confidence']
    box_top = pred['y'] - pred['height']/2
    box_bottom = pred['y'] + pred['height']/2

    price_box_top = pixel_to_price(box_top, img_height, price_top, 
price_bottom)
    price_box_bottom = pixel_to_price(box_bottom, img_height, price_top, 
price_bottom)

    if pattern == "cup and handle":
        entry = price_box_top
        sl = price_box_bottom
        risk = abs(entry - sl)
        tp1 = entry + risk * rr1
        tp2 = entry + risk * rr2
    elif pattern == "channel":
        entry = price_box_bottom
        sl = price_box_top
        risk = abs(entry - sl)
        tp1 = entry + risk * rr1
        tp2 = entry + risk * rr2
    elif pattern == "double-bottom":
        entry = price_box_top
        sl = price_box_bottom
        risk = abs(entry - sl)
        tp1 = entry + risk * rr1
        tp2 = entry + risk * rr2
    elif pattern == "flag":
        entry = price_box_top
        sl = price_box_bottom
        risk = abs(entry - sl)
        tp1 = entry + risk * rr1
        tp2 = entry + risk * rr2
    elif pattern == "resistance":
        entry = price_box_top
        sl = price_box_top + (abs(price_box_top - price_box_bottom) * 0.1)
        risk = abs(entry - sl)
        tp1 = entry - risk * rr1
        tp2 = entry - risk * rr2
    elif pattern == "triangle":
        entry = price_box_top
        sl = price_box_bottom
        risk = abs(entry - sl)
        tp1 = entry + risk * rr1
        tp2 = entry + risk * rr2
    else:
        return None
    return {
        'pattern': pattern,
        'entry': round(entry, 2),
        'sl': round(sl, 2),
        'tp1': round(tp1, 2),
        'tp2': round(tp2, 2),
        'confidence': round(conf, 3)
    }

def main_job():
    for asset in ASSETS:
        try:
            screenshot_and_detect(asset)
        except Exception as e:
            print(f"Error for {asset['name']}: {e}")

if __name__ == "__main__":
    setup_db()
    schedule.every(1).hours.do(main_job)

    print("Started multi-asset TA signal pipeline with auto price 
detection...")
    while True:
        schedule.run_pending()
        time.sleep(10)
