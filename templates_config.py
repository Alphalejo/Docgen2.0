TEMPLATES = {
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