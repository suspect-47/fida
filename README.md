# FIDA — Food Supplier Compliance Checker

FastAPI backend that combines FDA enforcement data + autonomous Hermes web research,
synthesized by an LLM into a structured compliance report.

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.11 + |
| pip | any recent |
| hermes CLI | optional (web research track) |

## Setup

```bash
# 1. Clone / enter project directory
cd tavera

# 2. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env and set TOKENROUTER_API_KEY

# 5. Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at **http://localhost:8000**.
Interactive docs: **http://localhost:8000/docs**

## Endpoints

### `POST /api/scan`
Scan a supplier for compliance issues.

**Request body:**
```json
{
  "supplier_name": "Acme Foods Inc.",
  "location": "Chicago, IL"   // optional
}
```

**Response:**
```json
{
  "supplier_name": "Acme Foods Inc.",
  "location": "Chicago, IL",
  "scanned_at": "2026-04-25T14:30:00+00:00",
  "report": {
    "score": 82,
    "status": "Clean",
    "fda_violations": 0,
    "last_fda_incident": "None on record",
    "web_risk_signals": "No significant signals found",
    "certifications": "SQF Level 2, USDA Organic",
    "summary": "Acme Foods has no FDA enforcement actions on record...",
    "recommendation": "Safe to use",
    "data_sources": ["FDA Enforcement DB", "Web Research via Hermes"]
  }
}
```

### `GET /api/health`
```json
{ "status": "ok", "hermes_available": true }
```

### `GET /api/recent`
Returns the last 5 scans as a JSON array.

## How it works

```
POST /api/scan
      │
      ├─► FDA API  ──────────────────────────────────┐
      │   api.fda.gov/food/enforcement.json           │
      │                                               ▼
      └─► Hermes CLI ──► subprocess (45 s timeout)  TokenRouter LLM
                          hermes chat --no-interactive  (qwen/qwen3-5-9b)
                                                        │
                                                        ▼
                                                  Compliance Report
                                                  (JSON, stored in memory)
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `TOKENROUTER_API_KEY` | Required. Your TokenRouter API key. |

## Notes

- Results are stored **in-memory only** — they reset when the server restarts.
- The Hermes track degrades gracefully: if the CLI is missing or times out the LLM
  still synthesises a report from FDA data alone.
- The FDA API is public and requires no key.
