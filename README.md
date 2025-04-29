# Slinky Crypto AI – Technical Analyst Detector

A Python utility that **screenshots live TradingView charts, detects classical chart patterns with a Roboflow-hosted YOLOv12 model, and stores structured trade ideas (entry / stop-loss / take-profit) in SQLite** for further automation or research.

> Built for crypto markets, but adaptable to any TradingView symbol.

---

## Features
- 📸 **Headless Chrome screenshots** of any TradingView chart  
- 🧠 **Object detection** (cup-and-handle, triangles, flags, etc.) via Roboflow Universe model  
- 🔢 **Auto-price extraction** from Y-axis → converts pixels ➜ price levels  
- 💾 **Signals saved** to SQLite (`signals.db`) with entry, SL, TP1, TP2, confidence  
- 🔄 **Cron-style scheduling** with [`schedule`](https://pypi.org/project/schedule/) (default: hourly)  

---

## Quick Demo
```bash
python slinky_detector.py      # ~20 s per asset
# → prints detection JSON and inserts rows into signals.db
```

<details>
<summary>Example log</summary>

```
Loading chart for BTC...
Screenshot for BTC saved.
Sending BTC to inference API...
{ "predictions": [ ... ] }
BTC: Inserted signal: {
  'pattern': 'triangle',
  'entry': 64320.5,
  'sl': 63411.2,
  'tp1': 65689.3,
  'tp2': 67058.0,
  'confidence': 0.79
}
```

</details>

---

## Prerequisites
| Tool             | Tested version |
|------------------|----------------|
| Python           | 3.10+          |
| Chrome/Chromium  | 124+           |
| ChromeDriver     | **Match** your browser version |

### Python packages
```bash
pip install selenium schedule inference-sdk
# GPU inference (optional)
pip install inference-gpu
```

---

## Installation
1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR-ORG/slinky-detector.git
   cd slinky-detector
   ```
2. **Install dependencies** (see above).  
3. **Download ChromeDriver** and place the binary in `$PATH`, or update `CHROME_DRIVER_PATH` in `slinky_detector.py`.  
4. **Get a Roboflow API key** – <https://universe.roboflow.com>.

---

## Configuration
Edit **`slinky_detector.py`**:

```python
ASSETS = [
    {"symbol": "BINANCE:BTCUSD", "name": "BTC",
     "url": "https://www.tradingview.com/chart/?symbol=BINANCE%3ABTCUSD"},
    # Add more assets as needed…
]

CHROME_DRIVER_PATH = "/absolute/path/to/chromedriver"
API_KEY            = "YOUR_ROBOFLOW_API_KEY"
MODEL_ID           = "slinky-crypto-ai-technical-analyst/1"

schedule.every(1).hours.do(main_job)   # Adjust run schedule if needed
```

> **Tip:** Run manually once before adding many assets to confirm selectors work.

---

## Running the detector
### One-off run
```bash
python slinky_detector.py
```

### Daemon / forever process
```bash
pm2 start slinky_detector.py --interpreter python3 --name slinky-detector
```
Or use `systemd`, `screen`, `tmux`, etc.

---

## Database schema
```sql
CREATE TABLE signals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  asset       TEXT,
  pattern     TEXT,
  entry       REAL,
  sl          REAL,
  tp1         REAL,
  tp2         REAL,
  confidence  REAL,
  detected_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Each detection generates a new row in the database.

---

## Model details
| Key                | Value |
|--------------------|-------|
| **Roboflow page**   | <https://universe.roboflow.com/slinky-hypercasual/slinky-crypto-ai-technical-analyst> |
| **Model ID**        | `slinky-crypto-ai-technical-analyst/1` |
| **Framework**       | YOLOv12 (Fast) |
| **mAP@0.5**         | 48.2% |
| **Precision / Recall** | 48.2% / 53.6% |

Supported classes: **cup-and-handle**, **channel**, **double-bottom**, **flag**, **resistance**, **triangle**.

---

## Roadmap
- 🔍 Improve false-positive filtering (trend context).  
- 📈 Add a utility to submit `signals.db` inputs to blockchain and use it for backtesting with verifiable proof.  
- 🔌 Integrate with Eliza and MCP for auto-trading.  
- 🖼️ Expand dataset to ≥ 1,000 annotated images and retrain with YOLOv12-L.  

---

 
