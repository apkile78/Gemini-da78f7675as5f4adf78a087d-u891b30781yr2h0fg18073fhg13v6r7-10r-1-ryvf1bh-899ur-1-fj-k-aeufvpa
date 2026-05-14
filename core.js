// --- ORIGINAL FEATURES ---
let savedSites = JSON.parse(localStorage.getItem('savedSites')) || [];
const viewer = document.getElementById("viewer");
let embedMode = "iframe";

function renderSavedSites() {
    const list = document.getElementById("savedSitesList");
    if(!list) return;
    list.innerHTML = "";
    savedSites.forEach((site, index) => {
        const div = document.createElement("div");
        div.className = "site-item";
        div.innerHTML = `<span onclick="updateViewer('${site}')">${site}</span> <button onclick="removeSite(${index})">x</button>`;
        list.appendChild(div);
    });
}

function removeSite(index) {
    savedSites.splice(index, 1);
    localStorage.setItem('savedSites', JSON.stringify(savedSites));
    renderSavedSites();
}

document.getElementById("saveBtn").onclick = () => {
    const url = document.getElementById("urlInput").value;
    if (url && !savedSites.includes(url)) {
        savedSites.push(url);
        localStorage.setItem('savedSites', JSON.stringify(savedSites));
        renderSavedSites();
    }
};

// --- MODE & VIEWER LOGIC ---
function updateViewer(url) {
    viewer.innerHTML = "";
    const tag = embedMode === "js" ? "iframe" : (embedMode === "iframe" ? "iframe" : "object");
    const el = document.createElement(tag);
    
    if (embedMode === "js") {
        viewer.appendChild(el);
        const doc = el.contentWindow.document;
        doc.open();
        doc.write(`<html><body style="background:#000;color:#fff;"><script>${url}<\/script></body></html>`);
        doc.close();
    } else {
        if (tag === "iframe") {
            el.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-scripts allow-same-origin");
            el.src = url;
        } else {
            el.data = url;
            el.type = "text/html";
        }
        el.style.width = "100%"; el.style.height = "100%"; el.style.border = "none";
        viewer.appendChild(el);
    }
}

// --- PLUGIN BRIDGE ---
async function devInject() {
    const target = document.querySelector("#viewer iframe") || document.querySelector("#viewer object");
    if (!target) return alert("Load a site first!");
    try {
        const res = await fetch('./plugin/plugin-core.js');
        const code = await res.text();
        target.contentWindow.eval(code);
    } catch (e) { alert("Injected failed - Try OBJ mode."); }
}

// Bindings
document.getElementById("goBtn").onclick = () => updateViewer(document.getElementById("urlInput").value);
document.getElementById("plgBtn").onclick = devInject;
document.getElementById("ifrBtn").onclick = () => embedMode = "iframe";
document.getElementById("jsBtn").onclick = () => embedMode = "js";
document.getElementById("objBtn").onclick = () => embedMode = "object";

// Initialize
renderSavedSites();