function toggleLang() {
        currentLang = currentLang === "en" ? "es" : "en";
        localStorage.setItem("lang", currentLang);
        document.getElementById("lang-toggle").textContent = currentLang === "en" ? "ES" : "EN";
        applyTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
     applyTranslations();
     applyTheme();

    const templateSelect = document.getElementById("template-select");
    const dynamicForm = document.getElementById("dynamic-form");
    const previewFrame = document.getElementById("preview-frame");
    const jsonUpload = document.getElementById("json-upload");
    
    let templatesConfig = {};
    let debounceTimer;

    // Load available templates
    fetch("/templates")
        .then(res => res.json())
        .then(data => {
            templatesConfig = data;
            for (const [key, val] of Object.entries(data)) {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = val.name;
                templateSelect.appendChild(option);
            }
            renderForm();
            updatePreview();
        });

    templateSelect.addEventListener("change", () => {
        renderForm();
        updatePreview();
    });

    function renderForm() {
        dynamicForm.innerHTML = "";
        const selectedKey = templateSelect.value;
        if (!selectedKey || !templatesConfig[selectedKey]) return;
        
        const fields = templatesConfig[selectedKey].fields;
        fields.forEach(field => {
            const group = document.createElement("div");
            group.className = "form-group";
            
            const label = document.createElement("label");
            label.textContent = field.label;
            label.htmlFor = field.name;
            
            let input = document.createElement(field.type === "textarea" ? "textarea" : "input");
            input.name = field.name;
            input.id = field.name;
            
            if (field.type !== "textarea") {
                input.type = field.type;
            }
            
            input.addEventListener("input", () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(updatePreview, 500);
            });

            group.appendChild(label);
            group.appendChild(input);
            dynamicForm.appendChild(group);
        });
    }

    function getPayload() {
        const formData = new FormData(dynamicForm);
        const data = Object.fromEntries(formData.entries());
        return {
            template: templateSelect.value,
            data: data
        };
    }

    function updatePreview() {
        const payload = getPayload();
        if (!payload.template) return;

        fetch("/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.text())
        .then(html => {
            previewFrame.srcdoc = html;
        });
    }

    document.getElementById("btn-preview").addEventListener("click", updatePreview);

    // Document exports
    document.getElementById("btn-pdf").addEventListener("click", () => exportFile("/export/pdf", "pdf"));
    document.getElementById("btn-docx").addEventListener("click", () => exportFile("/export/docx", "docx"));

    function exportFile(endpoint, extension) {
        const payload = getPayload();
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${payload.template}_export_${Date.now()}.${extension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        });
    }

    // JSON file parsing
    jsonUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        fetch("/import-json", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error("Invalid file");
            return res.json();
        })
        .then(data => {
            for (const [key, value] of Object.entries(data)) {
                const input = dynamicForm.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            }
            updatePreview();
            jsonUpload.value = ""; // Reset file input
        })
        .catch(err => {
            alert("Error: Please upload a valid JSON object file.");
            jsonUpload.value = "";
        });
    });
});