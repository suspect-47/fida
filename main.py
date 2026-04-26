import asyncio
import json
import os
import shutil
import subprocess
from collections import deque
from datetime import datetime, timezone
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
TOKENROUTER_BASE_URL = "https://api.tokenrouter.com/v1"
TOKENROUTER_API_KEY = os.getenv("TOKENROUTER_API_KEY", "")
MODEL = "qwen/qwen3.5-9b"
FDA_BASE = "https://api.fda.gov/food/enforcement.json"
HERMES_TIMEOUT = 45

app = FastAPI(title="Tavera Compliance API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store — last 5 scans
recent_scans: deque = deque(maxlen=5)

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class ScanRequest(BaseModel):
    supplier_name: str
    location: Optional[str] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _openai_client() -> OpenAI:
    return OpenAI(base_url=TOKENROUTER_BASE_URL, api_key=TOKENROUTER_API_KEY)


async def _fda_lookup(supplier_name: str) -> dict:
    """Query FDA food enforcement database for a supplier."""
    params = {
        "search": f'recalling_firm:"{supplier_name}"',
        "limit": 10,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get(FDA_BASE, params=params)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                return {
                    "found": len(results),
                    "records": results,
                    "raw_meta": data.get("meta", {}),
                }
            elif resp.status_code == 404:
                # FDA returns 404 when no records match — not an error
                return {"found": 0, "records": [], "raw_meta": {}}
            else:
                return {
                    "found": 0,
                    "records": [],
                    "error": f"FDA API returned {resp.status_code}",
                }
        except Exception as exc:
            return {"found": 0, "records": [], "error": str(exc)}


def _run_hermes(supplier_name: str) -> str:
    """Run the Hermes CLI agent and return its stdout."""
    message = (
        f"Research food supplier '{supplier_name}'. "
        "Find: 1) any news about recalls, lawsuits, or safety violations in the last 2 years, "
        "2) what certifications they claim on their website, "
        "3) any complaints on BBB or food industry forums. "
        "Return a structured summary with: news_findings, certifications_found, "
        "complaint_signals, overall_risk_indicator (Low/Medium/High). Plain text output."
    )
    try:
        result = subprocess.run(
            ["hermes", "chat", "-Q", "-q", message],
            capture_output=True,
            text=True,
            timeout=HERMES_TIMEOUT,
        )
        output = result.stdout.strip()
        if result.returncode != 0 and not output:
            stderr = result.stderr.strip()
            return f"[Hermes error (exit {result.returncode})]: {stderr or 'no output'}"
        return output or "[Hermes returned empty output]"
    except FileNotFoundError:
        return "[Hermes CLI not found — web research unavailable]"
    except subprocess.TimeoutExpired:
        return "[Hermes timed out after 45 seconds]"
    except Exception as exc:
        return f"[Hermes exception: {exc}]"


def _synthesize(supplier_name: str, fda_data: dict, hermes_output: str) -> dict:
    """Send FDA + Hermes data to TokenRouter and get a structured compliance report."""
    fda_summary = json.dumps(fda_data, indent=2)

    user_content = (
        f"Supplier: {supplier_name}\n\n"
        f"=== FDA Enforcement Data ===\n{fda_summary}\n\n"
        f"=== Independent Web Research (Hermes) ===\n{hermes_output}"
    )

    system_prompt = (
        "You are a food safety compliance analyst. "
        "Given FDA enforcement data AND independent web research about a supplier, "
        "produce a final compliance report as JSON:\n"
        "{\n"
        '  "score": <0-100>,\n'
        '  "status": "Clean" | "Warning" | "High Risk",\n'
        '  "fda_violations": <integer>,\n'
        '  "last_fda_incident": "<string>",\n'
        '  "web_risk_signals": "<string>",\n'
        '  "certifications": "<string>",\n'
        '  "summary": "<3 sentences>",\n'
        '  "recommendation": "Safe to use" | "Use with caution" | "Do not use",\n'
        '  "data_sources": ["FDA Enforcement DB", "Web Research via Hermes"]\n'
        "}\n"
        "Return only valid JSON."
    )

    client = _openai_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.post("/api/scan")
async def scan_supplier(req: ScanRequest):
    supplier = req.supplier_name.strip()
    if not supplier:
        raise HTTPException(status_code=400, detail="supplier_name must not be empty")

    # Step 1 — FDA lookup (async)
    fda_data = await _fda_lookup(supplier)

    # Step 2 — Hermes agent (blocking subprocess; run in thread pool)
    hermes_output = await asyncio.get_event_loop().run_in_executor(
        None, _run_hermes, supplier
    )

    # Step 3 — LLM synthesis (blocking; run in thread pool)
    try:
        report = await asyncio.get_event_loop().run_in_executor(
            None, _synthesize, supplier, fda_data, hermes_output
        )
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"LLM returned non-JSON response: {exc}"
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Synthesis failed: {exc}")

    # Step 4 — Persist and return
    record = {
        "supplier_name": supplier,
        "location": req.location,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "report": report,
    }
    recent_scans.appendleft(record)
    return record


@app.get("/api/health")
async def health():
    hermes_available = shutil.which("hermes") is not None
    return {"status": "ok", "hermes_available": hermes_available}


@app.get("/api/recent")
async def recent():
    return list(recent_scans)
