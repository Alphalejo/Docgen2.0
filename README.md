# Split-Screen Document Builder

A web-based application that allows users to dynamically build and preview documents (like Invoices and Reports) using a split-screen interface. Built with FastAPI, Jinja2, and vanilla web technologies.

## Features
- **Live Preview:** See document changes in real-time as you type.
- **Multiple Templates:** Supports dynamically loaded Jinja2 templates.
- **PDF Export:** Generates high-quality PDFs using `WeasyPrint`.
- **DOCX Export:** Generates native Word documents using `python-docx`.
- **Data Import:** Populate forms automatically by uploading a JSON file.

## Tech Stack
- **Backend:** FastAPI, Python
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Templating:** Jinja2
- **Document Generation:** WeasyPrint (PDF), python-docx (Word)

## Prerequisites
- Python 3.8 or higher
- **WeasyPrint Dependencies:**
  - **macOS:** `brew install pango`
  - **Windows:** Install GTK3 Runtime (see [WeasyPrint Windows Docs](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows))
  - **Linux:** `sudo apt-get install build-essential python3-dev python3-pip python3-setuptools python3-wheel python3-cffi libcairo2 pango1.0-tests`

## Installation & Setup

1. **Clone the repository** (or navigate to your project folder):
   ```bash
   git clone <your-repo-url>
   cd document-builder
   
```

2. **Create and activate a virtual environment:**
   ```bash
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   
```

4. **Run the application:**
   ```bash
   uvicorn app.main:app --reload
   
```

5. **Open the App:**
   Navigate to `http://127.0.0.1:8000` in your web browser.

## Project Structure
```text
app/
├── main.py
├── templates_config.py
├── templates/
│   ├── invoice.html
│   └── report.html
├── static/
│   ├── index.html
│   ├── style.css
│   └── main.js
└── requirements.txt