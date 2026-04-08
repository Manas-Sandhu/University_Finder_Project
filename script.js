const API_BASE = "http://universities.hipolabs.com/search";
let allUniversities = []; 
let favorites = JSON.parse(localStorage.getItem("uni_favs")) || [];
let showingFavorites = false; 
let searchTimer;

// This handles the "simultaneous" filtering without crashing the browser
function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => handleSearch(), 300); 
}

async function fetchUniversities(country, name) {
    try {
        const loader = document.getElementById("loader");
        if (loader) loader.classList.remove("hidden");
        
        const url = `${API_BASE}?name=${encodeURIComponent(name)}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        allUniversities = data.filter(uni => uni.name); 
        applyFiltersAndSort(); 
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        const loader = document.getElementById("loader");
        if (loader) loader.classList.add("hidden");
    }
}

function applyFiltersAndSort() {
    const sortOrder = document.getElementById("sortSelect").value;
    let data = showingFavorites 
        ? allUniversities.filter(uni => favorites.includes(uni.name)) 
        : allUniversities;

    // We use a slice to avoid mutating the original array while sorting
    const sortedData = [...data].sort((a, b) => sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    );
    
    displayUniversities(sortedData);
}

function displayUniversities(universities) {
    const container = document.getElementById("results");
    
    // PERFORMANCE FIX: Use a DocumentFragment to eliminate lag
    const fragment = document.createDocumentFragment();
    container.innerHTML = "";

    if (universities.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; opacity:0.5;">No results found.</p>`;
        return;
    }

    // Performance limit: Render top 200 for immediate responsiveness
    const toRender = universities.slice(0, 200);

    toRender.forEach(uni => {
        const isFav = favorites.includes(uni.name);
        const card = document.createElement("div");
        card.className = "card";
        
        card.innerHTML = `
            <button class="fav-btn">${isFav ? '❤️' : '🤍'}</button>
            <h3>${uni.name}</h3>
            <p><strong>Country:</strong> ${uni.country}</p>
            <p><strong>Domain:</strong> ${uni.domains?.[0] || "N/A"}</p>
            <a href="${uni.web_pages?.[0] || "#"}" target="_blank">🌐 Visit Website</a>
        `;

        card.querySelector(".fav-btn").addEventListener("click", () => toggleFavorite(uni.name));
        fragment.appendChild(card); // Add to memory fragment
    });

    container.appendChild(fragment); // Final update: Browser only repaints once
}

function toggleFavorite(name) {
    if (favorites.includes(name)) {
        favorites = favorites.filter(n => n !== name);
    } else {
        favorites.push(name);
    }
    localStorage.setItem("uni_favs", JSON.stringify(favorites));
    applyFiltersAndSort();
}

function toggleViewFavorites() {
    showingFavorites = !showingFavorites;
    const btn = document.getElementById("favToggle");
    if (btn) btn.innerText = showingFavorites ? "View All" : "View Favorites";
    applyFiltersAndSort();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerText = isLight ? "🌙" : "☀️";
}

function clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("countrySelect").selectedIndex = 0;
    showingFavorites = false;
    fetchUniversities("", "");
}

function handleSearch() {
    const name = document.getElementById("searchInput").value;
    const country = document.getElementById("countrySelect").value;
    fetchUniversities(country, name);
}

window.onload = () => {
    // Apply theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        const btn = document.getElementById("themeToggle");
        if (btn) btn.innerText = "🌙";
    }

    // Simultaneous search logic: trigger on every keystroke
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", debounceSearch);
    }

    fetchUniversities("", ""); 
};