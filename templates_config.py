TEMPLATES = {
   "cv": {
        "name": "Curriculum Vitae",
        "fields": [
            {"name": "name", "label": "Full Name", "label_es": "Nombre Completo", "type": "text"},
            {"name": "title", "label": "Professional Title", "label_es": "Título Profesional", "type": "text"},
            {"name": "email", "label": "Email", "label_es": "Correo Electrónico", "type": "text"},
            {"name": "location", "label": "Location", "label_es": "Ubicación", "type": "text"},
            {"name": "links", "label": "Links", "label_es": "Enlaces", "type": "links"},
            {"name": "summary", "label": "Summary", "label_es": "Resumen", "type": "rich-textarea"},
            {"name": "skills", "label": "Skills", "label_es": "Habilidades", "type": "skills"},
            {"name": "experience", "label": "Experience", "label_es": "Experiencia", "type": "experience"},
            {"name": "projects", "label": "Featured Projects", "label_es": "Proyectos Destacados", "type": "projects"},
            {"name": "education", "label": "Education", "label_es": "Educación", "type": "education"},
            {"name": "languages", "label": "Languages", "label_es": "Idiomas", "type": "languages"},
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