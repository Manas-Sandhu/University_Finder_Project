const API_BASE = "http://universities.hipolabs.com/search";
let allUniversities = []; 
let favorites = JSON.parse(localStorage.getItem("uni_favs")) || [];
let showingFavorites = false; 
let searchTimer;

function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => handleSearch(), 300); 
}

async function fetchUniversities(country, name) {
    try {
        const loader = document.getElementById("loader");
        if (loader) loader.classList.remove("hidden");

        // ✅ FIX: fallback to "a" when name is empty so API returns results
        const query = name.trim() === "" ? "a" : name.trim();
        const url = `${API_BASE}?name=${encodeURIComponent(query)}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
        
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

    const sortedData = [...data].sort((a, b) => sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    );
    
    displayUniversities(sortedData);
}

function displayUniversities(universities) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (universities.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; opacity:0.5;">No results found.</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    const toRender = universities.slice(0, 200);

    toRender.forEach(uni => {
        const isFav = favorites.includes(uni.name);
        const card = document.createElement("div");
        card.className = "card";

        const favBtn = document.createElement("button");
        favBtn.className = "fav-btn";
        favBtn.textContent = isFav ? "❤️" : "🤍";

        const title = document.createElement("h3");
        title.textContent = uni.name;

        const country = document.createElement("p");
        country.innerHTML = `<strong>Country:</strong> ${uni.country}`;

        const domain = document.createElement("p");
        domain.innerHTML = `<strong>Domain:</strong> ${uni.domains?.[0] || "N/A"}`;

        const link = document.createElement("a");
        link.href = uni.web_pages?.[0] || "#";
        link.target = "_blank";
        link.textContent = "🌐 Visit Website";

        // ✅ FIX: pass favBtn into toggleFavorite so only that button updates
        favBtn.addEventListener("click", () => toggleFavorite(uni.name, favBtn));

        card.append(favBtn, title, country, domain, link);
        fragment.appendChild(card); 
    });

    container.appendChild(fragment); 
}

// ✅ FIX: update only the clicked button, not the whole list
function toggleFavorite(name, btnEl) {
    const isNowFav = !favorites.includes(name);

    if (isNowFav) {
        favorites.push(name);
    } else {
        favorites = favorites.filter(n => n !== name);
    }

    localStorage.setItem("uni_favs", JSON.stringify(favorites));

    // Only update the single button that was clicked
    if (btnEl) {
        btnEl.textContent = isNowFav ? "❤️" : "🤍";
    }

    // Only re-render if in favorites view (cards need to disappear from list)
    if (showingFavorites) applyFiltersAndSort();
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
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        const btn = document.getElementById("themeToggle");
        if (btn) btn.innerText = "🌙";
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", debounceSearch);
    }

    fetchUniversities("", ""); 
};
