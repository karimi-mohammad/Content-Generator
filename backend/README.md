# Backend (Express) for Content Generator

This folder contains a minimal Express backend scaffold to support the content-generator UI.

Quick start

1. Open PowerShell and go to the backend folder:

```powershell
cd "i:\computer\My projs\other\content-generator-workflow\backend"
```

2. Install dependencies (if not already installed by the helper):

```powershell
npm install
```

3. Start the server:

```powershell
npm run start
```

Or for development with auto-reload (if you installed `nodemon`):

```powershell
npm run dev
```

Endpoints

- `GET /health` — health check
- `POST /api/generate-sections` — Returns a mocked list of sections. Expects JSON body with `topic`, `tone`, etc.
- `POST /api/generate-content` — Returns mocked content for a section. Expects JSON body with `topic` and `sectionTitle`.
- `POST /api/seo-check` — Runs a simple SEO report. Expects JSON with `content` and `keywords` array.

Gemini API usage

- To call the Gemini / Generative Language API you need to set an API key in `backend/.env` as:

```bash
GEMINI_API_KEY="YOUR_KEY_HERE"
```

- The default model used in the code is `text-bison-001` via the Google Generative Language REST endpoint. If you want to change model or endpoint, edit `routes/api.js`.

Gemini proxy support

- If you need to proxy all requests to the Gemini endpoint (e.g., for network routing, debugging, or filtering), add a `GEMINI_PROXY` value to `backend/.env` in the form `https://<host>:<port>` (the proxy must support https tunneling):

```bash
GEMINI_PROXY="https://127.0.0.1:12334"
```

- The proxy will be used by the `GET /api/test-gemini` and `POST /api/test-gemini` endpoints. That endpoint is intended for quick testing and will forward the provided prompt to the Gemini model while using the configured proxy.

- If the proxy is using a self-signed cert, set `GEMINI_PROXY_INSECURE=true` in `backend/.env` to allow the agent to skip TLS verification (not recommended for production):

```bash
GEMINI_PROXY_INSECURE=true
```

Example request for `test-gemini` (GET):

```powershell
Invoke-RestMethod -Uri 'http://localhost:4000/api/test-gemini' -Method GET
```

Example request for `test-gemini` (POST):

```bash
curl -X POST http://localhost:4000/api/test-gemini -H "Content-Type: application/json" -d '{"prompt": "Search the web and tell me the latest price of Bitcoin."}'
```

Example request for `generate-sections` (cURL):

```bash
curl -X POST http://localhost:4000/api/generate-sections -H "Content-Type: application/json" -d '{
 "Topic":"آموزش فعال ماضی درس عربی پایه هفتم",
 "tone":"آموزشی، ساده و رسمی",
 "desired_length": 600,
 "target_audience":"دانش‌آموزان پایه هفتم",
 "SEO_KeyWords": ["آموزش","عربی"],
 "SERP_titles": ["قواعد جمع در زبان عربی — نمونه و تمرین","تمرین جمع و مفرد برای دانش‌آموزان"],
 "SITE_NAME_SUBJECT": "سایت آموزشی",
 "Site_Posts": ["آموزش درس پنجم فارسی هفتم","آموزش عربی پایه هشتم"]
}'
```

Notes

- This is a scaffold with mocked responses. Replace the mock handlers in `routes/api.js` with real logic or calls to AI services as needed.
