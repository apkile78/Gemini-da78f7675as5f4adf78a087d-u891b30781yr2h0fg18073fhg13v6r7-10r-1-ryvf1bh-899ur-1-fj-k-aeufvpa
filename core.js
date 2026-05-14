// --- STATE MANAGEMENT ---
let savedSites = JSON.parse(localStorage.getItem('savedSites')) || [];
let embedMode = "iframe";

// --- UI ELEMENT REFS ---
const viewer = document.getElementById("viewer");
const urlInput = document.getElementById("urlInput");
const menuPanel = document.getElementById("menuPanel");

// --- CORE FUNCTIONS ---
function updateViewer(url) {
    if (!url) return;
    viewer.innerHTML = "";
    let el;

    if (embedMode === "js") {
        el = document.createElement("iframe");
        viewer.appendChild(el);
        const doc = el.contentWindow.document;
        doc.open();
        doc.write(`<html><body style="background:#000;color:#fff;"><script>${url}<\/script></body></html>`);
        doc.close();
    } else {
        el = document.createElement(embedMode === "object" ? "object" : "iframe");
        if (embedMode === "object") {
            el.data = url;
            el.type = "text/html";
        } else {
            el.src = url;
            el.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-scripts allow-same-origin");
        }
        el.style.width = "100%";
        el.style.height = "100%";
        el.style.border = "none";
        viewer.appendChild(el);
    }
}

function renderSavedSites() {
    const list = document.getElementById("savedSitesList");
    list.innerHTML = "";
    savedSites.forEach((site, index) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.padding = "5px";
        item.innerHTML = `<span style="color:#aaa; cursor:pointer;">${site}</span><button onclick="removeSite(${index})">x</button>`;
        item.querySelector('span').onclick = () => { urlInput.value = site; updateViewer(site); };
        list.appendChild(item);
    });
}

window.removeSite = (index) => {
    savedSites.splice(index, 1);
    localStorage.setItem('savedSites', JSON.stringify(savedSites));
    renderSavedSites();
};

// --- BUTTON LISTENERS ---

// Top Bar
document.getElementById("goBtn").onclick = () => updateViewer(urlInput.value);

document.getElementById("saveBtn").onclick = () => {
    if (urlInput.value && !savedSites.includes(urlInput.value)) {
        savedSites.push(urlInput.value);
        localStorage.setItem('savedSites', JSON.stringify(savedSites));
        renderSavedSites();
    }
};

document.getElementById("menuBtn").onclick = () => {
    menuPanel.style.display = menuPanel.style.display === "none" ? "block" : "none";
};

document.getElementById("vewBtn").onclick = () => {
    if (urlInput.value) window.open(urlInput.value, '_blank');
};

document.getElementById("hdeBtn").onclick = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = sidebar.style.display === "none" ? "block" : "none";
};

// Menu Panel Buttons
document.getElementById("ifrBtn").onclick = () => { embedMode = "iframe"; menuPanel.style.display = "none"; };
document.getElementById("jsBtn").onclick = () => { embedMode = "js"; menuPanel.style.display = "none"; };
document.getElementById("objBtn").onclick = () => { embedMode = "object"; menuPanel.style.display = "none"; };

document.getElementById("plgBtn").onclick = async () => {
    const target = viewer.querySelector("iframe") || viewer.querySelector("object");
    if (!target) return alert("Load a site first!");
    try {
        const res = await fetch('./plugin/plugin-core.js');
        const code = await res.text();
        target.contentWindow.eval(code);
        menuPanel.style.display = "none";
    } catch (e) {
        alert("Injection blocked. Try 'embed' mode.");
    }
};

// Init
renderSavedSites();