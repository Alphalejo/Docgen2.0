// i18n.js
const TRANSLATIONS = {
    en: {
        live_preview: "Live Preview",
        doc_builder: "Document Builder",
        load_json: "Load JSON",
        force_preview: "Force Preview Refresh",
        download_pdf: "Download PDF",
        download_docx: "Download DOCX",
        toggle_theme: "🌙",
        settings: "Settings"
    },
    es: {
        live_preview: "Vista Previa",
        doc_builder: "Constructor de Documentos",
        load_json: "Cargar JSON",
        force_preview: "Actualizar Vista Previa",
        download_pdf: "Descargar PDF",
        download_docx: "Descargar DOCX",
        toggle_theme: "🌙",
        settings: "Configuración"
    }
};

let currentLang = localStorage.getItem("lang") || "en";
let currentTheme = localStorage.getItem("theme") || "light";

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = TRANSLATIONS[currentLang][el.dataset.i18n];
    });

}

function applyTheme() {
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.getElementById("theme-toggle").textContent = currentTheme === "light" ? "🌙" : "☀️";
    
    document.getElementById("logo-dark").style.display = currentTheme === "light" ? "block" : "none";
    document.getElementById("logo-light").style.display = currentTheme === "dark" ? "block" : "none";
}

function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
    applyTheme();
    updatePreview();
}

function toggleMenu() {
    document.getElementById("side-menu").classList.toggle("open");
}

function toggleLang() {
    currentLang = currentLang === "en" ? "es" : "en";
    localStorage.setItem("lang", currentLang);
    document.getElementById("lang-toggle").textContent = currentLang === "en" ? "ES" : "EN";
    applyTranslations();
    
    if (window.renderForm) {
        // Save current values before re-render
        const saved = {};
        document.querySelectorAll("#dynamic-form input, #dynamic-form textarea, #dynamic-form select").forEach(el => {
            if (el.name) saved[el.name] = el.value;
        });
        
        window.renderForm();
        
        // Restore simple values after re-render
        setTimeout(() => {
            Object.entries(saved).forEach(([name, value]) => {
                const el = document.querySelector(`[name="${name}"]`);
                if (el) el.value = value;
            });
        }, 50);
    }
}