# Content Generator Workflow

A simple AI-powered article generator built with Node.js and Express, featuring a web-based UI for creating structured content using Google Gemini API.

## Description / Overview

This project provides an automated workflow for generating educational articles or content pieces. It leverages Google's Gemini (Generative Language API) to create article outlines, generate section content with continuity, and convert the final Markdown output to WordPress-friendly HTML. The application includes a simple, user-friendly frontend for editing and managing the generated content.

The motivation behind this tool is to streamline content creation for educational websites, particularly for subjects like Arabic language learning, by automating the repetitive aspects of article writing while maintaining quality and coherence.

## Demo / Screenshots

![Content Generator UI](https://via.placeholder.com/800x400?text=Content+Generator+Workflow+Demo)

Sample screenshot of the article generation interface (placeholder - replace with actual image)

For API-based demos:

- **Generate Outline Endpoint**: `POST /api/generate-outline` with topic and keywords returns structured sections.
- **Generate Content Endpoint**: `POST /api/generate-content` produces section-specific content.
- **Convert Markdown Endpoint**: `POST /api/convert-markdown` transforms Markdown to HTML.

## Features

- **AI-Powered Outline Generation**: Creates suggested article sections (H2/H3) based on topic and keywords
- **Sequential Content Generation**: Generates content for individual sections with continuity from previous sections
- **Bulk Generation**: Auto-generates all sections sequentially with a single click
- **Markdown to HTML Conversion**: Converts generated content to WordPress-friendly HTML with specific formatting rules
- **Interactive UI**: Client-side interface for editing sections, managing content, and downloading results
- **Proxy Support**: Configurable HTTP/HTTPS proxy for outbound API requests
- **Environment-Based Configuration**: Secure API key management via environment variables

## Project Structure

```text
content-generator-workflow/
├── README.md                 # Project documentation
├── WORKFLOW.MD               # Project workflow notes
├── UI.md                     # UI details and specifications
├── backend/                  # Express server and API
│   ├── package.json          # Backend dependencies and scripts
│   ├── server.js             # Main server entry point
│   ├── routes/
│   │   └── api.js            # API route handlers
│   ├── .env.example          # Environment variables template
│   └── .env                  # Local environment (not committed)
└── client/                   # Static frontend
    ├── index.html            # Main UI page
    └── assets/
        ├── app.js            # Frontend JavaScript logic
        └── styles.css        # UI styles
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Google Generative Language API Key** (Gemini API)
- Optional: HTTP/HTTPS proxy if required for outbound traffic

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd content-generator-workflow
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your API key:

```bash
cp .env.example .env
```

Edit `.env` and set your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
# Optional proxy settings
HTTP_PROXY=http://127.0.0.1:12334
HTTPS_PROXY=http://127.0.0.1:12334
```

### 4. Start the Application

From the backend directory:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will start on `http://localhost:4000` and serve the client interface.

## Usage

1. **Access the Application**: Open `http://localhost:4000` in your web browser.

2. **Enter Initial Parameters**:
   - Topic: Main article subject
   - Tone: Writing style (e.g., educational, formal)
   - Keywords: Comma-separated SEO keywords
   - Desired Length: Target word count
   - Target Audience: Intended readers

3. **Generate Outline**: Click "تولید بخش‌ها" to get suggested article sections.

4. **Edit Sections**: In the suggested sections panel, modify titles and add notes as needed.

5. **Generate Content**:
   - Generate individual sections using "تولید محتوا" buttons
   - Or generate all sections automatically with "تولید همه بخش‌ها"

6. **Convert and Download**:
   - The system automatically converts Markdown to HTML
   - Use "تبدیل مجدد به HTML" to re-convert if needed
   - Copy HTML with "کپی HTML" or download with "دانلود"

### API Usage Examples

**Test API Connectivity**:

```bash
curl http://localhost:4000/api/test-gemini
```

**Generate Outline**:

```bash
curl -X POST http://localhost:4000/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{
    "Topic": "Arabic Grammar Basics",
    "tone": "educational",
    "desired_length": 1000,
    "target_audience": "students",
    "SEO_KeyWords": ["arabic", "grammar"],
    "SERP_titles": ["Title 1", "Title 2"],
    "SITE_NAME_SUBJECT": "Educational Site",
    "Site_Posts": []
  }'
## Contribution Guide

We welcome contributions to improve this project!

### Development Workflow

# Content Generator Workflow

A developer-focused prototype that automates article creation using the Google Generative Language (Gemini) API. It provides an Express-based API and a lightweight static frontend to generate outlines, produce sectioned content, and convert Markdown to WordPress-friendly HTML.

**One-line Description**
- A small Node.js app that generates SEO-aware article outlines and section content using Gemini and converts Markdown to WordPress-ready HTML.

**Description / Overview**
- Purpose: Accelerate content production by automating repetitive writing tasks while preserving control for editors.
- Motivation: Reduce time spent on outlining, drafting, and formatting content for educational and multilingual sites (the project includes Persian/Arabic-focused prompts). The app helps teams iterate faster on article drafts and export ready-to-paste HTML for WordPress.
- What it solves: Produces structured outlines, generates coherent section content with continuity between sections, and formats Markdown into a constrained HTML output suitable for WordPress editors.

**Demo / Screenshots**
- Screenshot (placeholder): ![Content Generator UI](https://via.placeholder.com/900x420?text=Content+Generator+Workflow+UI)
- Example API endpoints (server exposes these under the `/api` prefix):
  - `GET /api/test-gemini` — test connectivity to the Gemini API.
  - `POST /api/generate-outline` — produce an article outline (expects JSON body with `Topic`, `SITE_NAME_SUBJECT`, `SEO_KeyWords`, etc.).
  - `POST /api/generate-content` — generate a single section's Markdown (accepts `subject`, `part`, `length`, `previousContent`, etc.).
  - `POST /api/convert-markdown` — convert Markdown to constrained HTML for WordPress editors.

**Features**
- **Outline generation**: Create H1/H2/H3 outlines with per-section word estimates.
- **Chunked section generation**: Produce article sections sequentially while passing previous content to maintain coherence.
- **Markdown → WordPress HTML**: Convert Markdown into limited HTML (no <p>/<h> tags; spans with `font-size: 14pt;` as required by the formatter).
- **Static frontend**: Minimal UI to generate, preview, edit, and download content.
- **Proxy support**: Honor `HTTP_PROXY` / `HTTPS_PROXY` environment variables for outbound requests.
- **Environment-driven config**: Keeps API keys and proxies outside source control.

**Project Structure**
```

content-generator-workflow/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js            # Express server (serves client and /api routes)
│   └── routes/
│       └── api.js           # API handlers for Gemini integration and conversion
├── client/
│   ├── index.html
│   └── assets/
│       ├── app.js
│       └── styles.css
└── WORKFLOW.MD / UI.md      # Notes and UI design (optional)

```

**Prerequisites**
- **Node.js** v18 or newer
- **npm** (bundled with Node.js)
- **Google Gemini API Key** (set as `GEMINI_API_KEY` or `GOOGLE_API_KEY` in `backend/.env` or your environment)
- Optional: HTTP/HTTPS proxy if your network requires it (`HTTP_PROXY` / `HTTPS_PROXY`).

**Installation & Setup**

1. Clone the repository and change into the project folder:
```bash
git clone <repository-url>
cd content-generator-workflow
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Configure environment variables.

- Copy the example environment file:

```powershell
Copy-Item .env.example -Destination .env
```

- Edit `backend/.env` and set your API key:

```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
# (Optional)
HTTP_PROXY=http://127.0.0.1:12334
HTTPS_PROXY=http://127.0.0.1:12334
```

4. Start the server (development):

```bash
# From backend/
npm start

# Or with auto-reload (if configured):
npm run dev
```

The app serves the static UI from `client/` and listens on `http://localhost:4000` by default. The API is available under `http://localhost:4000/api`.

**Usage**

- Open the UI: `http://localhost:4000` in a browser.
- Typical workflow:
  1. Provide topic, tone, keywords, and target audience.
  2. Generate an outline via the UI or `POST /api/generate-outline`.
  3. Generate each section (or bulk-generate) using `POST /api/generate-content`.
  4. Convert the final Markdown with `POST /api/convert-markdown` and paste the returned HTML into WordPress.

API examples (curl):

```bash
# Test Gemini connectivity
curl http://localhost:4000/api/test-gemini

# Generate outline
curl -X POST http://localhost:4000/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{
    "Topic": "Arabic Grammar Basics",
    "tone": "educational",
    "desired_length": 1000,
    "target_audience": "students",
    "SEO_KeyWords": ["arabic","grammar"],
    "SERP_titles": ["Title 1"],
    "SITE_NAME_SUBJECT": "Educational Site",
    "Site_Posts": []
  }'

# Generate a section
curl -X POST http://localhost:4000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Arabic Grammar Basics",
    "part": "Introduction",
    "length": 250,
    "SEO_KeyWords": ["arabic"],
    "SITE_NAME_SUBJECT": "Educational Site",
    "notes": "Focus on beginner-friendly examples",
    "tone": "educational",
    "target_audience": "students",
    "sectionIndex": 1,
    "previousContent": ""
  }'

# Convert Markdown to HTML
curl -X POST http://localhost:4000/api/convert-markdown \
  -H "Content-Type: application/json" \
  -d '{ "markdown_content": "# Title\\nSome paragraph content..." }'
```

**Contribution Guide**

- Branching: Use feature branches (`feature/your-feature-name`) and open a PR against `main`.
- Issues: Open issues describing bugs or feature requests with steps to reproduce and expected behavior.
- PRs: Keep changes small, signpost breaking changes, and include tests or manual verification steps where applicable.
- Commit messages: Use clear imperative messages (e.g., "Add generate-outline validation").

**Authors**

- **<YOUR_NAME>** — Initial development. Replace with your name and GitHub link.

**Badges**

- ![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
- ![Express.js](https://img.shields.io/badge/express-5.x-lightgrey)
- ![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

**Notes & Dev Tips**

- `backend/server.js` serves the static `client/` folder and mounts API routes from `backend/routes/api.js`.
- The API expects a server-side API key set via `GEMINI_API_KEY` or `GOOGLE_API_KEY` (see `server.js` warnings).
- `generate-content` accepts `previousContent` to keep continuity between sequentially-generated sections.
- `convert-markdown` is tailored to output HTML limited to `span` elements with `style="font-size: 14pt;"`, `strong`, `ul/li` and `<hr />` as described in the route handler.

If you'd like, I can:

- run the server locally and verify the `/api/test-gemini` route (requires an API key),
- or open a PR with this README and commit it for you.

---

*This README is intended as a developer-oriented starting point. Please replace placeholders (API URL, authors, badges) with real values for production use.*
