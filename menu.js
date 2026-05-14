const searchContainer = document.getElementById("searchContainer");
const savedContainer = document.getElementById("savedSites");

// ——————————————————————————————
// SIDEBAR TOGGLE
// ——————————————————————————————
document.getElementById("openBtn").onclick = () => {
    searchContainer.classList.add("active");
};

document.getElementById("closeBtn").onclick = () => {
    searchContainer.classList.remove("active");
};

// ——————————————————————————————
// SAVE SITE LOGIC
// ——————————————————————————————
document.getElementById("saveBtn").onclick = () => {
    const urlToSave = window.currentUrl || document.getElementById("urlInput").value.trim();
    if (!urlToSave) return;

    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];

    if (!savedSites.includes(urlToSave)) {
        savedSites.push(urlToSave);
        localStorage.setItem("savedSites", JSON.stringify(savedSites));
        displaySavedSites();
    }
};

// ——————————————————————————————
// DISPLAY & DELETE LOGIC
// ——————————————————————————————
function displaySavedSites() {
    savedContainer.innerHTML = "";
    const savedSites = JSON.parse(localStorage.getItem("savedSites")) || [];

    savedSites.forEach((site, index) => {
        const item = document.createElement("div");
        item.className = "savedItem";

        // Site Link
        const link = document.createElement("span");
        link.style.cssText = "cursor:pointer; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:210px;";
        link.textContent = site;
        link.onclick = () => {
            document.getElementById("urlInput").value = site;
            updateViewer(site);
            searchContainer.classList.remove("active");
        };

        // Delete Button
        const del = document.createElement("span");
        del.style.cssText = "color:#ff4444; cursor:pointer; font-weight:bold; padding-left:10px;";
        del.textContent = "X";
        del.onclick = (e) => {
            e.stopPropagation();
            savedSites.splice(index, 1);
            localStorage.setItem("savedSites", JSON.stringify(savedSites));
            displaySavedSites();
        };

        item.appendChild(link);
        item.appendChild(del);
        savedContainer.appendChild(item);
    });
}

// Initial Render
displaySavedSites();

// ——————————————————————————————
// UI HIDE SYSTEM (GHOST MODE)
// ——————————————————————————————
document.getElementById("hdeBtn").onclick = () => {
    document.body.classList.add("uiHidden");
    searchContainer.classList.remove("active");
};

document.getElementById("mnuReveal").onclick = () => {
    document.body.classList.remove("uiHidden");
};
