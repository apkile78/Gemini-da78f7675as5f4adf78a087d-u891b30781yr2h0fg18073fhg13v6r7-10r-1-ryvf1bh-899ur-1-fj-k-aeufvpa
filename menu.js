const searchContainer = document.getElementById("searchContainer");
const savedContainer = document.getElementById("savedSites");

document.getElementById("openBtn").onclick = () => searchContainer.classList.add("active");
document.getElementById("closeBtn").onclick = () => searchContainer.classList.remove("active");

document.getElementById("saveBtn").onclick = () => {
    const url = window.currentUrl || urlInput.value.trim();
    if (!url) return;
    const saved = JSON.parse(localStorage.getItem("savedSites")) || [];
    if (!saved.includes(url)) {
        saved.push(url);
        localStorage.setItem("savedSites", JSON.stringify(saved));
        displaySavedSites();
    }
};

function displaySavedSites() {
    savedContainer.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem("savedSites")) || [];
    saved.forEach((site, i) => {
        const div = document.createElement("div");
        div.className = "savedItem";
        div.innerHTML = `<span style="cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${site}</span><span style="color:red;cursor:pointer">X</span>`;
        div.firstChild.onclick = () => { urlInput.value = site; updateViewer(site); searchContainer.classList.remove("active"); };
        div.lastChild.onclick = () => { saved.splice(i, 1); localStorage.setItem("savedSites", JSON.stringify(saved)); displaySavedSites(); };
        savedContainer.appendChild(div);
    });
}

document.getElementById("hdeBtn").onclick = () => {
    document.body.classList.add("uiHidden");
    searchContainer.classList.remove("active");
};
document.getElementById("mnuReveal").onclick = () => document.body.classList.remove("uiHidden");

displaySavedSites();
