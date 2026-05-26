TEMPLATES = {
    "cv": {
        "name": "Curriculum Vitae",
        "fields": [
            {"name": "name", "label": "Full Name", "type": "text"},
            {"name": "title", "label": "Professional Title", "type": "text"},
            {"name": "email", "label": "Email", "type": "text"},
            {"name": "location", "label": "Location", "type": "text"},
            {"name": "links", "label": "Links", "type": "links"},
            {"name": "summary", "label": "Summary", "type": "textarea"},
            {"name": "skills", "label": "Skills", "type": "skills"},
            {"name": "experience", "label": "Experience", "type": "experience"},
            {"name": "projects", "label": "Featured Projects", "type": "projects"},
            {"name": "education", "label": "Education", "type": "education"},
            {"name": "languages", "label": "Languages", "type": "languages"},
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