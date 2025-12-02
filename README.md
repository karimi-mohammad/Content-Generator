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

1. **Fork the Repository**: Create your own fork on GitHub
2. **Create a Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your improvements
4. **Test Thoroughly**: Ensure all functionality works correctly
5. **Submit a Pull Request**: Describe your changes and their benefits

### Guidelines

- Use environment variables for configuration (no hard-coded secrets)
- Add appropriate error handling and logging
- Update documentation for any new features
- Follow existing code style and structure

### Suggested Improvements

- Add rate limiting for API calls
- Implement caching for repeated requests
- Expand frontend with more editing capabilities
- Add support for multiple AI providers
- Include comprehensive test suite

## Authors

- **<YOUR_NAME>** - Initial development - [GitHub Profile](https://github.com/yourusername)

## Badges

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-5.2.0-lightgrey)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/content-generator-workflow.svg)](https://github.com/yourusername/content-generator-workflow/issues)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/content-generator-workflow.svg)](https://github.com/yourusername/content-generator-workflow/stargazers)

---

*This is a prototype for development/internal use. Not intended for production without additional security and scalability enhancements.*
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

*This is a prototype for development/internal use. Not intended for production without additional security and scalability enhancements.*
