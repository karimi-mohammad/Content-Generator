# Content Generator Workflow (simple AI-powered article generator)

A small Node.js + Express project providing an AI-powered article generator with a simple frontend. It uses Google Gemini (Generative Language API) to create an outline, generate section content with continuity, and convert Markdown to WordPress-friendly HTML. This repo includes a simple UI to edit and manage generated sections.

✅ Features

- Generate suggested outline and sections for a given `Topic` and keywords.
- Generate content for individual sections, providing the previous section's content for continuity.
- Auto-generate all sections one-by-one (sequential generation) using a single click.
- Convert Markdown to WordPress-friendly HTML with specific formatting rules.
- Client-side UI to edit, produce, copy, and download the resulting HTML.

---

## Project Structure

- `backend/` - Express server and API route handlers
  - `server.js` - Entry point that serves the client and registers routes
  - `routes/api.js` - API endpoints for AI interactions
- `client/` - Static client UI
  - `index.html` - The main frontend form and display
  - `assets/app.js` - Frontend logic to call API and manage UI workflow
  - `assets/styles.css` - Minimal UI styles
- `README.md` - This file
- `WORKFLOW.MD` - Project workflow notes
- `UI.md` - UI details

---

## Quick Start

Prerequisites

- Node.js (v18+) and npm
- If you use a proxy for outbound traffic, ensure it's running and available
- A valid Google Generative Language API key (or another service) if you intend to use the AI backend

1) Install backend dependencies

```powershell
cd backend
npm install
```

2) Configure the API key and optionally the proxy

- The backend reads the API key from environment variables instead of hard-coded values. Set `GEMINI_API_KEY` (preferred) or `GOOGLE_API_KEY` as needed and `HTTP_PROXY`/`HTTPS_PROXY` for proxy settings. For local development you can create `backend/.env` (not committed) from `backend/.env.example`.

Example (powershell):

```powershell
# Recommended variable name: GEMINI_API_KEY (fallback: GOOGLE_API_KEY)
$env:GEMINI_API_KEY = 'your_google_gen_api_key'
$env:HTTP_PROXY = 'http://127.0.0.1:12334'
```

3) Start the backend

```powershell
npm start
```

Open the client at <http://localhost:4000/> and use the simple UI.

---

## How to use

1. Enter the main `Topic`, `keywords`, and other details in the initial form.
2. Click `تولید بخش‌ها` to get a suggested outline (H2/H3s).
3. In the `بخش‌های پیشنهادی` panel, edit titles, notes and optionally generate individual section content using the `تولید محتوا` button.
   - When generating a single section, the UI sends the immediate previous section content (`previousContent`) for continuity.
   - A loading overlay will appear during the request.
4. To generate every section in order automatically, click `تولید همه بخش‌ها` — the app will call `/api/generate-content` for each section sequentially and show a loading overlay
5. When all sections are generated, the article is compiled and the UI will send the full Markdown to `/api/convert-markdown` to produce WordPress-friendly HTML.
6. If conversion fails (or you want to re-run it), use the `تبدیل مجدد به HTML` button. There's also a `کپی HTML` and a `دانلود` button.

---

## API Endpoints

All endpoints are served under `/api` on the configured server port (default: `4000`).

- `GET /api/test-gemini` — Test the Gemini API connectivity
- `POST /api/generate-outline`
  - Body (example):

    ```json
    {
      "Topic": "آموزش جمع کرنے",
      "tone": "آموزشی",
      "desired_length": 1000,
      "target_audience": "دانش‌آموزان",
      "SEO_KeyWords": ["عربی","تمرین"],
      "SERP_titles": ["عنوان1","عنوان2"],
      "SITE_NAME_SUBJECT": "سایت آموزشی",
      "Site_Posts": []
    }
    ```

  - Response: JSON with `title`, `sections` and `internal_links` fields

- `POST /api/generate-content`
  - Body example:

    ```json
    {
      "subject": "آموزش جمع",
      "part": "مقدمه",
      "length": 200,
      "SEO_KeyWords": ["عربی"],
      "SITE_NAME_SUBJECT": "سایت آموزشی",
      "notes": "نکات خاص..",
      "tone": "آموزشی",
      "target_audience": "دانش‌آموزان",
      "sectionIndex": 1,
      "previousContent": "..."
    }
    ```

  - Response: `{ status: <HTTP status>, content: '<generated_markdown>' }`

- `POST /api/convert-markdown`
  - Body: `{ "markdown_content": "# Title\nYour article..." }`
  - Response: `{ status: <HTTP status>, html: '<converted_html>' }`

---

## Notes & Dev Tips

- The `previousContent` passed to `/generate-content` is designed to be the immediate previous section's Markdown content — this helps the model maintain continuity without resending the entire article.
- The front-end includes a `تولید همه بخش‌ها` flow that sequentially generates content for each ungenerated section. You can interrupt it by reloading the page.
- By default, the Gemini API key and proxy are hard-coded to get you started quickly. Replace them with secure environment variables in production.
- The `convert-markdown` endpoint expects clean Markdown and returns a WordPress-friendly HTML that uses only the allowed inline style (font-size) and limited tags, as per the code's instructions to the AI model.

---

## Debugging

- The server logs will show responses from the Gemini API. If you get a `500 Failed to parse JSON response` from `generate-outline`, it means the AI returned something JSON-like but unparsable; review the raw output in the server logs.
- If `convert-markdown` returns an invalid HTML or errors, try clicking `تبدیل مجدد به HTML` in the UI, or inspect the `finalMarkdown` payload and re-run the endpoint.

---

## Contribution

Feel free to fork and extend the project. Suggested improvements:

- Use environment variables instead of hard-coded API keys
- Add rate limiting and retries for the AI calls
- Introduce caching for repeated requests
- Expand front-end to support editing of generated HTML before download

---

## License

This is a small prototype for internal/development use — not for production. No license attached.

---

If you want, I can also add a `backend/.env.example` and update `backend/routes/api.js` to read key and proxy from environment variables. Would you like me to implement that now?
