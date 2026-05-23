TEMPLATES = {
    "cv": {
        "name": "Curriculum Vitae",
        "fields": [
            {"name": "name", "label": "Full Name", "type": "text"},
            {"name": "title", "label": "Professional Title", "type": "text"},
            {"name": "email", "label": "Email", "type": "text"},
            {"name": "location", "label": "Location", "type": "text"},
            {"name": "linkedin", "label": "LinkedIn URL", "type": "text"},
            {"name": "github", "label": "GitHub URL", "type": "text"},
            {"name": "portfolio", "label": "Portfolio URL", "type": "text"},
            {"name": "summary", "label": "Professional Summary", "type": "textarea"},
            {"name": "skills", "label": "Skills (JSON array)", "type": "textarea"},
            {"name": "experience", "label": "Experience (JSON array)", "type": "textarea"},
            {"name": "education", "label": "Education (JSON array)", "type": "textarea"},
            {"name": "languages", "label": "Languages", "type": "textarea"}
        ]
    },
    "invoice": {
        "name": "Invoice",
        "fields": [
            {"name": "company_name", "label": "Company Name", "type": "text"},
            {"name": "client_name", "label": "Client Name", "type": "text"},
            {"name": "invoice_number", "label": "Invoice Number", "type": "text"},
            {"name": "date", "label": "Date", "type": "date"},
            {"name": "amount", "label": "Amount ($)", "type": "number"},
            {"name": "description", "label": "Description", "type": "textarea"}
        ]
    },
    "report": {
        "name": "Monthly Report",
        "fields": [
            {"name": "title", "label": "Report Title", "type": "text"},
            {"name": "author", "label": "Author", "type": "text"},
            {"name": "date", "label": "Date", "type": "date"},
            {"name": "summary", "label": "Executive Summary", "type": "textarea"},
            {"name": "metrics", "label": "Key Metrics", "type": "textarea"}
        ]
    }
}