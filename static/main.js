// Global variables
let previewFrame;
let templateSelect;
let dynamicForm;
let debounceTimer;
let docLang = "en";
let templatesConfig = {};

function getPayload() {
        const formData = new FormData(dynamicForm);
        const data = Object.fromEntries(formData.entries());

        // Links
        const linksContainer = document.getElementById("links-container");
        if (linksContainer) {
            const links = [];
            linksContainer.querySelectorAll("div").forEach(row => {
                const name = row.querySelector(".link-name")?.value.trim();
                const url = row.querySelector(".link-url")?.value.trim();
                if (name || url) links.push({ name, url });
            });
            data.links = JSON.stringify(links);
        }

        // Skills
        const skillsContainer = document.getElementById("skills-container");
        if (skillsContainer) {
            const skills = [];
            skillsContainer.querySelectorAll(".dynamic-row").forEach(row => {
                const category = row.querySelector(".skill-category")?.value.trim();
                const items = row.querySelector(".skill-items")?.value.trim();
                if (category || items) skills.push({ category, items });
            });
            data.skills = JSON.stringify(skills);
        }

        // Experience
        const expContainer = document.getElementById("experience-container");
        if (expContainer) {
            const experience = [];
            expContainer.querySelectorAll(".exp-entry").forEach(entry => {
                experience.push({
                    role: entry.querySelector(".exp-role")?.value.trim(),
                    start_date: entry.querySelector(".exp-start")?.value.trim(),
                    end_date: entry.querySelector(".exp-end")?.value.trim(),
                    current: entry.querySelector(".exp-current")?.checked,
                    company: entry.querySelector(".exp-company")?.value.trim(),
                    location: entry.querySelector(".exp-location")?.value.trim(),
                    content: entry.querySelector(".exp-content")?.value.trim(),
                });
            });
            data.experience = JSON.stringify(experience);
        }

        // Projects
        const projContainer = document.getElementById("projects-container");
        if (projContainer) {
            const projects = [];
            projContainer.querySelectorAll(".proj-entry").forEach(entry => {
                projects.push({
                    name: entry.querySelector(".proj-name")?.value.trim(),
                    date: entry.querySelector(".proj-date")?.value.trim(),
                    tech: entry.querySelector(".proj-tech")?.value.trim(),
                    link: entry.querySelector(".proj-link")?.value.trim(),
                    content: entry.querySelector(".proj-content")?.value.trim(),
                });
            });
            data.projects = JSON.stringify(projects);
        }

        // Education
        const eduContainer = document.getElementById("education-container");
        if (eduContainer) {
            const education = [];
            eduContainer.querySelectorAll(".edu-entry").forEach(entry => {
                education.push({
                    title: entry.querySelector(".edu-title")?.value.trim(),
                    date: entry.querySelector(".edu-date")?.value.trim(),
                    in_progress: entry.querySelector(".edu-progress")?.checked,
                    institution: entry.querySelector(".edu-institution")?.value.trim(),
                    description: entry.querySelector(".edu-description")?.value.trim(),
                });
            });
            data.education = JSON.stringify(education);
        }

        // Languages
        const langContainer = document.getElementById("languages-container");
        if (langContainer) {
            const languages = [];
            langContainer.querySelectorAll(".lang-input").forEach(input => {
                if (input.value.trim()) languages.push(input.value.trim());
            });
            data.languages = JSON.stringify(languages);
        }

        return { template: templateSelect.value, data, doc_lang: docLang };
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
    // Read background color from parent
    const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg").trim();

    const pageBreakStyle = `
    <style>
        @media screen {
            body {
                counter-reset: page-counter;
            }
            .page-break-indicator {
                width: calc(100% + 110px);
                margin: 40px 0 40px -60px;
                box-shadow: inset 0 8px 8px -8px rgba(0,0,0,0.1), inset 0 -8px 8px -8px rgba(0,0,0,0.1);
                height: 30px;
                background: ${bgColor};
                position: relative;
                display: flex;
                align-items: baseline;
                justify-content: flex-end;
                padding-right: 12px;
            }
            .page-break-indicator::after {
                content: "Page " counter(page-counter);
                counter-increment: page-counter;
                font-size: 9px;
                color: #888;
                font-family: sans-serif;
            }
        }
    </style>
    <script>
        const PAGE_HEIGHT = 905;

        function injectPageBreaks() {
            document.querySelectorAll(".page-break-indicator").forEach(el => el.remove());

            const body = document.body;
            let currentHeight = 0;
            let pageNum = 1;
            const indicators = [];

            // Walk through all elements and find where page breaks occur
            const elements = Array.from(body.children);
            for (const el of elements) {
                const elBottom = el.offsetTop + el.offsetHeight;
                if (elBottom > currentHeight + PAGE_HEIGHT) {
                    indicators.push({ afterEl: el, page: pageNum });
                    currentHeight = el.offsetTop;
                    pageNum++;
                }
            }

            indicators.forEach(({ afterEl }) => {
                const indicator = document.createElement("div");
                indicator.className = "page-break-indicator";
                afterEl.parentNode.insertBefore(indicator, afterEl.nextSibling);
            });
        }

        window.addEventListener("load", injectPageBreaks);
    <\/script>`;

    previewFrame.srcdoc = html.replace("</body>", pageBreakStyle + "</body>");
    previewFrame.addEventListener("load", () => {
    previewFrame.style.height = previewFrame.contentDocument.body.scrollHeight + "px";
});
});
}

function setDocLang(lang) {
    docLang = lang;
    document.getElementById("doc-lang-en").classList.toggle("active", lang === "en");
    document.getElementById("doc-lang-es").classList.toggle("active", lang === "es");
    updatePreview();
}

document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    applyTheme();

    previewFrame = document.getElementById("preview-frame");
    templateSelect = document.getElementById("template-select");
    dynamicForm = document.getElementById("dynamic-form");
    const jsonUpload = document.getElementById("json-upload");
    document.getElementById("btn-load-json").addEventListener("click", () => {
        document.getElementById("json-upload").click();
    });
    
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


    function addLinkRow(container) {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; gap:8px; margin-bottom:8px;";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Label";
        nameInput.className = "link-name";
        nameInput.style.flex = "1";
        nameInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updatePreview, 500);
        });

        const urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.placeholder = "https://...";
        urlInput.className = "link-url";
        urlInput.style.flex = "2";
        urlInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updatePreview, 500);
        });

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "✕";
        removeBtn.className = "btn-outline";
        removeBtn.style.cssText = "width:auto; padding:4px 8px; font-size:0.8rem;";
        removeBtn.addEventListener("click", () => {
            row.remove();
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updatePreview, 500);
        });

        row.appendChild(nameInput);
        row.appendChild(urlInput);
        row.appendChild(removeBtn);
        container.appendChild(row);
    }

    window.renderForm = function() {
        dynamicForm.innerHTML = "";
        const selectedKey = templateSelect.value;
        if (!selectedKey || !templatesConfig[selectedKey]) return;
        
        const fields = templatesConfig[selectedKey].fields;
        fields.forEach(field => {

            if (field.type === "links") {
                const group = document.createElement("div");
                group.className = "form-group";

                const headerRow = document.createElement("div");
                headerRow.style.cssText = "display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;";

                const label = document.createElement("label");
                label.textContent = currentLang === "es" && field.label_es ? field.label_es : field.label;
                label.style.margin = "0";

                const addBtn = document.createElement("button");
                addBtn.type = "button";
                addBtn.textContent = "+ Add Link";
                addBtn.className = "btn-outline";
                addBtn.style.cssText = "width:auto; padding:3px 10px; font-size:0.75rem;";
                addBtn.addEventListener("click", () => addLinkRow(linksContainer));

                headerRow.appendChild(label);
                headerRow.appendChild(addBtn);

                const linksContainer = document.createElement("div");
                linksContainer.id = "links-container";

                group.appendChild(headerRow);
                group.appendChild(linksContainer);
                dynamicForm.appendChild(group);
                return;
            }

            if (field.type === "skills") {
                const group = document.createElement("div");
                group.className = "form-group";
                const labelText = currentLang === "es" && field.label_es ? field.label_es : field.label;
                const headerRow = makeHeaderRow(labelText, () => addSkillRow(container));
                const container = document.createElement("div");
                container.id = "skills-container";
                group.appendChild(headerRow);
                group.appendChild(container);
                dynamicForm.appendChild(group);
                return;
            }

            if (field.type === "experience") {
                const group = document.createElement("div");
                group.className = "form-group";
                const labelText = currentLang === "es" && field.label_es ? field.label_es : field.label;
                const headerRow = makeHeaderRow(labelText, () => addExperienceRow(container));
                const container = document.createElement("div");
                container.id = "experience-container";
                group.appendChild(headerRow);
                group.appendChild(container);
                dynamicForm.appendChild(group);
                return;
            }

            if (field.type === "education") {
                const group = document.createElement("div");
                group.className = "form-group";
                const labelText = currentLang === "es" && field.label_es ? field.label_es : field.label;
                const headerRow = makeHeaderRow(labelText, () => addEducationRow(container));
                const container = document.createElement("div");
                container.id = "education-container";
                group.appendChild(headerRow);
                group.appendChild(container);
                dynamicForm.appendChild(group);
                return;
            }

            if (field.type === "languages") {
                const group = document.createElement("div");
                group.className = "form-group";
                const labelText = currentLang === "es" && field.label_es ? field.label_es : field.label;
                const headerRow = makeHeaderRow(labelText, () => addLanguageRow(container));
                const container = document.createElement("div");
                container.id = "languages-container";
                group.appendChild(headerRow);
                group.appendChild(container);
                dynamicForm.appendChild(group);
                return;
            }

            if (field.type === "projects") {
                const group = document.createElement("div");
                group.className = "form-group";
                const labelText = currentLang === "es" && field.label_es ? field.label_es : field.label;
                const headerRow = makeHeaderRow(labelText, () => addProjectRow(container));
                const container = document.createElement("div");
                container.id = "projects-container";
                group.appendChild(headerRow);
                group.appendChild(container);
                dynamicForm.appendChild(group);
                return;
            }

            const group = document.createElement("div");
            group.className = "form-group";
            
            const label = document.createElement("label");
            label.textContent = currentLang === "es" && field.label_es ? field.label_es : field.label;
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

    function makeHeaderRow(labelText, onAdd) {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;";
        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.margin = "0";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "+ Add";
        btn.className = "btn-outline";
        btn.style.cssText = "width:auto; padding:3px 10px; font-size:0.75rem;";
        btn.addEventListener("click", onAdd);
        row.appendChild(label);
        row.appendChild(btn);
        return row;
    }

    function makeRemoveBtn(row) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "✕";
        btn.className = "btn-outline";
        btn.style.cssText = "width:auto; padding:4px 8px; font-size:0.8rem; align-self:flex-start;";
        btn.addEventListener("click", () => { row.remove(); triggerPreview(); });
        return btn;
    }

    function triggerPreview() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 500);
    }

    function addSkillRow(container) {
        const row = document.createElement("div");
        row.className = "dynamic-row";
        row.style.cssText = "display:flex; gap:8px; margin-bottom:8px; align-items:center;";

        const categoryInput = document.createElement("input");
        categoryInput.type = "text";
        categoryInput.placeholder = "Category";
        categoryInput.className = "skill-category";
        categoryInput.style.flex = "1";
        categoryInput.addEventListener("input", triggerPreview);

        const itemsInput = document.createElement("input");
        itemsInput.type = "text";
        itemsInput.placeholder = "Skills (comma separated)";
        itemsInput.className = "skill-items";
        itemsInput.style.flex = "2";
        itemsInput.addEventListener("input", triggerPreview);

        row.appendChild(categoryInput);
        row.appendChild(itemsInput);
        row.appendChild(makeRemoveBtn(row));
        container.appendChild(row);
    }

    function addExperienceRow(container) {
        const entry = document.createElement("div");
        entry.className = "exp-entry";
        entry.style.cssText = "border:1px solid var(--border); border-radius:4px; padding:10px; margin-bottom:10px; display:flex; flex-direction:column; gap:8px;";

        // Row 1: role, start date, end date, current checkbox
        const row1 = document.createElement("div");
        row1.style.cssText = "display:flex; gap:8px; align-items:center;";

        const roleInput = document.createElement("input");
        roleInput.type = "text";
        roleInput.placeholder = "Job Title";
        roleInput.className = "exp-role";
        roleInput.style.flex = "2";
        roleInput.addEventListener("input", triggerPreview);

        const startInput = document.createElement("input");
        startInput.type = "text";
        startInput.placeholder = "MM/YYYY";
        startInput.className = "exp-start";
        startInput.style.flex = "1";
        startInput.addEventListener("input", triggerPreview);

        const endInput = document.createElement("input");
        endInput.type = "text";
        endInput.placeholder = "MM/YYYY";
        endInput.className = "exp-end";
        endInput.style.flex = "1";
        endInput.addEventListener("input", triggerPreview);

        const currentLabel = document.createElement("label");
        currentLabel.style.cssText = "display:flex; align-items:center; gap:4px; font-size:0.75rem; white-space:nowrap; text-transform:none; font-weight:normal;";
        const currentCheck = document.createElement("input");
        currentCheck.type = "checkbox";
        currentCheck.className = "exp-current";
        currentCheck.addEventListener("change", () => {
            endInput.disabled = currentCheck.checked;
            endInput.style.opacity = currentCheck.checked ? "0.4" : "1";
            triggerPreview();
        });
        currentLabel.appendChild(currentCheck);
        currentLabel.appendChild(document.createTextNode("Present"));

        row1.appendChild(roleInput);
        row1.appendChild(startInput);
        row1.appendChild(endInput);
        row1.appendChild(currentLabel);

        // Row 2: company, location
        const row2 = document.createElement("div");
        row2.style.cssText = "display:flex; gap:8px;";

        const companyInput = document.createElement("input");
        companyInput.type = "text";
        companyInput.placeholder = "Company";
        companyInput.className = "exp-company";
        companyInput.style.flex = "2";
        companyInput.addEventListener("input", triggerPreview);

        const locationInput = document.createElement("input");
        locationInput.type = "text";
        locationInput.placeholder = "Location";
        locationInput.className = "exp-location";
        locationInput.style.flex = "1";
        locationInput.addEventListener("input", triggerPreview);

        row2.appendChild(companyInput);
        row2.appendChild(locationInput);

        // Row 3: content textarea
        const contentTextarea = document.createElement("textarea");
        contentTextarea.placeholder = "Describe your role and achievements...";
        contentTextarea.className = "exp-content";
        contentTextarea.style.cssText = "width:100%; min-height:80px; resize:vertical;";
        contentTextarea.addEventListener("input", triggerPreview);

        const removeBtn = makeRemoveBtn(entry);

        entry.appendChild(row1);
        entry.appendChild(row2);
        entry.appendChild(contentTextarea);
        entry.appendChild(removeBtn);
        container.appendChild(entry);
    }

    function addProjectRow(container) {
        const entry = document.createElement("div");
        entry.className = "proj-entry";
        entry.style.cssText = "border:1px solid var(--border); border-radius:4px; padding:10px; margin-bottom:10px; display:flex; flex-direction:column; gap:8px;";

        // Row 1: name, date
        const row1 = document.createElement("div");
        row1.style.cssText = "display:flex; gap:8px;";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Project Name";
        nameInput.className = "proj-name";
        nameInput.style.flex = "2";
        nameInput.addEventListener("input", triggerPreview);

        const dateInput = document.createElement("input");
        dateInput.type = "text";
        dateInput.placeholder = "MM/YYYY";
        dateInput.className = "proj-date";
        dateInput.style.flex = "1";
        dateInput.addEventListener("input", triggerPreview);

        row1.appendChild(nameInput);
        row1.appendChild(dateInput);

        // Row 2: tech stack, link
        const row2 = document.createElement("div");
        row2.style.cssText = "display:flex; gap:8px;";

        const techInput = document.createElement("input");
        techInput.type = "text";
        techInput.placeholder = "Tech Stack (e.g. Python, FastAPI, Docker)";
        techInput.className = "proj-tech";
        techInput.style.flex = "2";
        techInput.addEventListener("input", triggerPreview);

        const linkInput = document.createElement("input");
        linkInput.type = "text";
        linkInput.placeholder = "URL (optional)";
        linkInput.className = "proj-link";
        linkInput.style.flex = "1";
        linkInput.addEventListener("input", triggerPreview);

        row2.appendChild(techInput);
        row2.appendChild(linkInput);

        // Row 3: description
        const descTextarea = document.createElement("textarea");
        descTextarea.placeholder = "Describe the project, your role and impact...";
        descTextarea.className = "proj-content";
        descTextarea.style.cssText = "width:100%; min-height:80px; resize:vertical;";
        descTextarea.addEventListener("input", triggerPreview);

        entry.appendChild(row1);
        entry.appendChild(row2);
        entry.appendChild(descTextarea);
        entry.appendChild(makeRemoveBtn(entry));
        container.appendChild(entry);
    }

    function addEducationRow(container) {
        const entry = document.createElement("div");
        entry.className = "edu-entry";
        entry.style.cssText = "border:1px solid var(--border); border-radius:4px; padding:10px; margin-bottom:10px; display:flex; flex-direction:column; gap:8px;";

        // Row 1: title, date, in_progress checkbox
        const row1 = document.createElement("div");
        row1.style.cssText = "display:flex; gap:8px; align-items:center;";

        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.placeholder = "Degree / Certificate";
        titleInput.className = "edu-title";
        titleInput.style.flex = "2";
        titleInput.addEventListener("input", triggerPreview);

        const dateInput = document.createElement("input");
        dateInput.type = "text";
        dateInput.placeholder = "MM/YYYY";
        dateInput.className = "edu-date";
        dateInput.style.flex = "1";
        dateInput.addEventListener("input", triggerPreview);

        const progressLabel = document.createElement("label");
        progressLabel.style.cssText = "display:flex; align-items:center; gap:4px; font-size:0.75rem; white-space:nowrap; text-transform:none; font-weight:normal;";
        const progressCheck = document.createElement("input");
        progressCheck.type = "checkbox";
        progressCheck.className = "edu-progress";
        progressCheck.addEventListener("change", () => {
            dateInput.disabled = progressCheck.checked;
            dateInput.style.opacity = progressCheck.checked ? "0.4" : "1";
            triggerPreview();
        });
        progressLabel.appendChild(progressCheck);
        progressLabel.appendChild(document.createTextNode("In Progress"));

        row1.appendChild(titleInput);
        row1.appendChild(dateInput);
        row1.appendChild(progressLabel);

        // Row 2: institution, description
        const row2 = document.createElement("div");
        row2.style.cssText = "display:flex; gap:8px;";

        const institutionInput = document.createElement("input");
        institutionInput.type = "text";
        institutionInput.placeholder = "Institution";
        institutionInput.className = "edu-institution";
        institutionInput.style.flex = "1";
        institutionInput.addEventListener("input", triggerPreview);

        const descInput = document.createElement("input");
        descInput.type = "text";
        descInput.placeholder = "Description (optional)";
        descInput.className = "edu-description";
        descInput.style.flex = "2";
        descInput.addEventListener("input", triggerPreview);

        row2.appendChild(institutionInput);
        row2.appendChild(descInput);

        entry.appendChild(row1);
        entry.appendChild(row2);
        entry.appendChild(makeRemoveBtn(entry));
        container.appendChild(entry);
    }

    function addLanguageRow(container) {
        const row = document.createElement("div");
        row.className = "dynamic-row";
        row.style.cssText = "display:flex; gap:8px; margin-bottom:8px;";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "e.g. English – Advanced";
        input.className = "lang-input";
        input.style.flex = "1";
        input.addEventListener("input", triggerPreview);

        row.appendChild(input);
        row.appendChild(makeRemoveBtn(row));
        container.appendChild(row);
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
            // Simple fields
            for (const [key, value] of Object.entries(data)) {
                const input = dynamicForm.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            }

            // Links
            if (data.links) {
                const container = document.getElementById("links-container");
                if (container) {
                    container.innerHTML = "";
                    data.links.forEach(link => {
                        addLinkRow(container);
                        const row = container.lastElementChild;
                        row.querySelector(".link-name").value = link.name || "";
                        row.querySelector(".link-url").value = link.url || "";
                    });
                }
            }

            // Skills
            if (data.skills) {
                const container = document.getElementById("skills-container");
                if (container) {
                    container.innerHTML = "";
                    data.skills.forEach(skill => {
                        addSkillRow(container);
                        const row = container.lastElementChild;
                        row.querySelector(".skill-category").value = skill.category || "";
                        row.querySelector(".skill-items").value = skill.items || "";
                    });
                }
            }

            // Experience
            if (data.experience) {
                const container = document.getElementById("experience-container");
                if (container) {
                    container.innerHTML = "";
                    data.experience.forEach(job => {
                        addExperienceRow(container);
                        const entry = container.lastElementChild;
                        entry.querySelector(".exp-role").value = job.role || "";
                        entry.querySelector(".exp-start").value = job.start_date || "";
                        entry.querySelector(".exp-company").value = job.company || "";
                        entry.querySelector(".exp-location").value = job.location || "";
                        entry.querySelector(".exp-content").value = job.content || "";
                        const currentCheck = entry.querySelector(".exp-current");
                        const endInput = entry.querySelector(".exp-end");
                        currentCheck.checked = job.current || false;
                        if (job.current) {
                            endInput.disabled = true;
                            endInput.style.opacity = "0.4";
                        } else {
                            endInput.value = job.end_date || "";
                        }
                    });
                }
            }

            // Projects
            if (data.projects) {
                const container = document.getElementById("projects-container");
                if (container) {
                    container.innerHTML = "";
                    data.projects.forEach(proj => {
                        addProjectRow(container);
                        const entry = container.lastElementChild;
                        entry.querySelector(".proj-name").value = proj.name || "";
                        entry.querySelector(".proj-date").value = proj.date || "";
                        entry.querySelector(".proj-tech").value = proj.tech || "";
                        entry.querySelector(".proj-link").value = proj.link || "";
                        entry.querySelector(".proj-content").value = proj.content || "";
                    });
                }
            }

            // Education
            if (data.education) {
                const container = document.getElementById("education-container");
                if (container) {
                    container.innerHTML = "";
                    data.education.forEach(edu => {
                        addEducationRow(container);
                        const entry = container.lastElementChild;
                        entry.querySelector(".edu-title").value = edu.title || "";
                        entry.querySelector(".edu-institution").value = edu.institution || "";
                        entry.querySelector(".edu-description").value = edu.description || "";
                        const progressCheck = entry.querySelector(".edu-progress");
                        const dateInput = entry.querySelector(".edu-date");
                        progressCheck.checked = edu.in_progress || false;
                        if (edu.in_progress) {
                            dateInput.disabled = true;
                            dateInput.style.opacity = "0.4";
                        } else {
                            dateInput.value = edu.date || "";
                        }
                    });
                }
            }

            // Languages
            if (data.languages) {
                const container = document.getElementById("languages-container");
                if (container) {
                    container.innerHTML = "";
                    data.languages.forEach(lang => {
                        addLanguageRow(container);
                        container.lastElementChild.querySelector(".lang-input").value = lang;
                    });
                }
            }

            updatePreview();
            jsonUpload.value = "";
        })
        .catch(() => {
            alert("Error: Please upload a valid JSON object file.");
            jsonUpload.value = "";
        });
    });
});