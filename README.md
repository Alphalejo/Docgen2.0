# Split-Screen Document Builder[cite: 1]

A web-based application that allows users to dynamically build and preview documents (like Invoices and Reports) using a split-screen interface. Built with FastAPI, Jinja2, and vanilla web technologies.[cite: 1]

## Features[cite: 1]
- **Live Preview:** See document changes in real-time as you type.[cite: 1]
- **Multiple Templates:** Supports dynamically loaded Jinja2 templates.[cite: 1]
- **PDF Export:** Generates high-quality PDFs using `WeasyPrint`.[cite: 1]
- **DOCX Export:** Generates native Word documents using `python-docx`.[cite: 1]
- **Data Import:** Populate forms automatically by uploading a JSON file.[cite: 1]

## Tech Stack[cite: 1]
- **Backend:** FastAPI, Python[cite: 1]
- **Frontend:** Vanilla HTML, CSS, JavaScript[cite: 1]
- **Templating:** Jinja2[cite: 1]
- **Document Generation:** WeasyPrint (PDF), python-docx (Word)[cite: 1]

## Prerequisites[cite: 1]
- Python 3.8 or higher[cite: 1]
- **WeasyPrint Dependencies:**[cite: 1]
  - **macOS:** `brew install pango`[cite: 1]
  - **Windows:** Install GTK3 Runtime (see [WeasyPrint Windows Docs](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#windows))[cite: 1]
  - **Linux:** `sudo apt-get install build-essential python3-dev python3-pip python3-setuptools python3-wheel python3-cffi libcairo2 pango1.0-tests`[cite: 1]

## Installation & Setup[cite: 1]

1. **Clone the repository** (or navigate to your project folder):[cite: 1]
   ```bash
   git clone <your-repo-url>
   cd document-builder
   
```[cite: 1]

2. **Create and activate a virtual environment:**[cite: 1]
   ```bash
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
```[cite: 1]

3. **Install dependencies:**[cite: 1]
   ```bash
   pip install -r requirements.txt
   
```[cite: 1]

4. **Run the application:**[cite: 1]
   ```bash
   uvicorn app.main:app --reload
   
```[cite: 1]

5. **Open the App:**[cite: 1]
   Navigate to `http://127.0.0.1:8000` in your web browser.[cite: 1]

## Project Structure[cite: 1]
```text
app/[cite: 1]
├── main.py[cite: 1]
├── templates_config.py[cite: 1]
├── templates/[cite: 1]
│   ├── invoice.html[cite: 1]
│   └── report.html[cite: 1]
├── static/[cite: 1]
│   ├── index.html[cite: 1]
│   ├── style.css[cite: 1]
│   └── main.js[cite: 1]
└── requirements.txt[cite: 1]