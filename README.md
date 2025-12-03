# Content Generator Workflow

A simple AI-powered article generator built with Node.js and Express, featuring a web-based UI for creating structured content using Google Gemini API.

## Description / Overview

This project provides an automated workflow for generating educational articles or content pieces. It leverages Google's Gemini (Generative Language API) to create article outlines, generate section content with continuity, convert Markdown to HTML, generate SEO information for topics, and optimize existing text for SEO. The application includes a simple, user-friendly frontend for editing and managing the generated content.

The motivation behind this tool is to streamline content creation for websites, by automating the repetitive aspects of article writing while maintaining quality and coherence.

## Demo / Screenshots

![Content Generator UI](https://github.com/karimi-mohammad/Content-Generator/blob/main/docs/file/Screenshot.png)

Sample screenshot of the article generation interface

For API-based demos:

- **Generate Outline Endpoint**: `POST /api/generate-outline` with topic and keywords returns structured sections.
- **Generate Content Endpoint**: `POST /api/generate-content` produces section-specific content.
- **Generate SEO Info Endpoint**: `POST /api/generate-seo-info` with topic returns SEO data in JSON format.
- **Optimize SEO Endpoint**: `POST /api/optimize-seo` optimizes text for SEO.
- **Convert Markdown Endpoint**: `POST /api/convert-markdown` transforms Markdown to HTML.

## Features

- **AI-Powered Outline Generation**: Creates suggested article sections (H2/H3) based on topic and keywords
- **Sequential Content Generation**: Generates content for individual sections with continuity from previous sections
- **Bulk Generation**: Auto-generates all sections sequentially with a single click
- **Markdown to HTML Conversion**: Converts generated content to WordPress-friendly HTML with specific formatting rules
- **SEO Information Generation**: Generates comprehensive SEO data including keywords, title, meta description, and article structure for a given topic
- **Text Optimization for SEO**: Optimizes existing text for better SEO by incorporating keywords naturally
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
    ├── seo.html              # SEO information generation tool
    ├── optimize.html         # Text optimization for SEO tool
    ├── markdown.html         # Markdown to HTML converter
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

## Docker Setup

Alternatively, you can run the application using Docker for easier deployment.

### Docker Prerequisites

- **Docker** installed on your system
- **Docker Compose** (optional, for easier management)

### Build and Run with Docker

1. **Build the Docker image**:

```bash
docker build -t content-generator .
```

2. **Run the container**:

```bash
docker run -p 4000:4000 -e GEMINI_API_KEY=your_api_key_here content-generator
```

Replace `your_api_key_here` with your actual Google Gemini API key.

### Using Docker Compose

For easier management, use the provided `docker-compose.yml`:

1. **Set your API key** in `docker-compose.yml` or create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

2. **Run with Docker Compose**:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:4000`.

## Usage

1. **Access the Application**: Open `http://localhost:4000` in your web browser.

2. **Main Article Generation**:
   - Enter Initial Parameters: Topic, tone, keywords, desired length, target audience
   - Generate Outline: Click "تولید بخش‌ها" to get suggested sections
   - Edit Sections: Modify titles and add notes
   - Generate Content: Use individual or bulk generation
   - Convert and Download: Get HTML output

3. **SEO Tools**:
   - **SEO Information Generator**: Go to `http://localhost:4000/seo.html`, enter a topic, and get comprehensive SEO data (keywords, title, meta description, etc.)
   - **Text Optimizer**: Go to `http://localhost:4000/optimize.html`, enter text and keywords to optimize for SEO

4. **Markdown Converter**: Use `http://localhost:4000/markdown.html` to convert Markdown to WordPress-friendly HTML

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
```

**Generate SEO Information**:

```bash
curl -X POST http://localhost:4000/api/generate-seo-info \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "آموزش برنامه‌نویسی پایتون"
  }'
```

Response:

```json
{
  "status": 200,
  "data": {
    "title": "آموزش برنامه‌نویسی پایتون برای مبتدیان",
    "meta_description": "آموزش کامل برنامه‌نویسی پایتون از پایه تا پیشرفته...",
    "snippet": "یادگیری برنامه‌نویسی پایتون آسان و کاربردی است...",
    "keywords": {
      "main": ["پایتون", "برنامه‌نویسی"],
      "secondary": ["آموزش پایتون", "کد نویسی"],
      "long_tail": ["آموزش برنامه‌نویسی پایتون از صفر", "چگونه پایتون یاد بگیریم"]
    },
    "outline": [
      {
        "h1": "آموزش برنامه‌نویسی پایتون",
        "h2": ["مقدمه", "نصب پایتون"],
        "h3": ["مزایای پایتون", "نصب در ویندوز"]
      }
    ]
  }
}
```

**Optimize for SEO**:

```bash
curl -X POST http://localhost:4000/api/optimize-seo \
   -H "Content-Type: application/json" \
   -d '{
      "input_text": "متن اصلی خود را اینجا قرار دهید.\nبا پاراگراف‌ها و تیترها مشخص شود.",
      "keywords": ["کلمه کلیدی اول", "کلمه کلیدی دوم"]
   }'
```

Response:

```json
{ "status": 200, "optimized_text": "<optimized Persian text>" }
```

## Contribution Guide

We welcome contributions to improve this project!

- Branching: Use feature branches (`feature/your-feature-name`) and open a PR against `main`.
- Issues: Open issues describing bugs or feature requests with steps to reproduce and expected behavior.
- PRs: Keep changes small, signpost breaking changes, and include tests or manual verification steps where applicable.
- Commit messages: Use clear imperative messages (e.g., "Add generate-outline validation").

**Authors**

- **Mohammad Karimi** — Initial development.

**Badges**

- ![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

- ![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

**Notes & Dev Tips**

- `backend/server.js` serves the static `client/` folder and mounts API routes from `backend/routes/api.js`.
- The API expects a server-side API key set via `GEMINI_API_KEY` or `GOOGLE_API_KEY` (see `server.js` warnings).
- `generate-content` accepts `previousContent` to keep continuity between sequentially-generated sections.
- `convert-markdown` is tailored to output HTML limited to `span` elements with `style="font-size: 14pt;"`, `strong`, `ul/li` and `<hr />` as described in the route handler.
