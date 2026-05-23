// i18n.js
const TRANSLATIONS = {
    en: {
        live_preview: "Live Preview",
        doc_builder: "Document Builder",
        load_json: "Load JSON",
        force_preview: "Force Preview Refresh",
        download_pdf: "Download PDF",
        download_docx: "Download DOCX",
        toggle_theme: "🌙"
    },
    es: {
        live_preview: "Vista Previa",
        doc_builder: "Constructor de Documentos",
        load_json: "Cargar JSON",
        force_preview: "Actualizar Vista Previa",
        download_pdf: "Descargar PDF",
        download_docx: "Descargar DOCX",
        toggle_theme: "🌙"
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
}

function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
    applyTheme();
}