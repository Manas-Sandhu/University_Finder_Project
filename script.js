const API_BASE = "http://universities.hipolabs.com/search";
let allUniversities = []; 
let favorites = JSON.parse(localStorage.getItem("uni_favs")) || [];
let showingFavorites = false; 

function handleLiveInput() {
    const query = document.getElementById("searchInput").value;
    // When text is cleared, reload the default list instead of wiping data
    if (query === "") {
        fetchUniversities("", ""); 
    }
}

function clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("countrySelect").selectedIndex = 0;
    document.getElementById("sortSelect").selectedIndex = 0;
    showingFavorites = false;
    document.getElementById("favToggle").innerText = "View Favorites";
    fetchUniversities("", ""); 
}

async function fetchUniversities(country, name) {
    try {
        showLoader();
        const response = await fetch(`${API_BASE}?name=${encodeURIComponent(name)}${country ? `&country=${encodeURIComponent(country)}` : ''}`);
        const data = await response.json();
        allUniversities = data.filter(uni => uni.name); 
        applyFiltersAndSort(); 
    } catch (error) {
        showError("❌ Error loading data.");
    } finally {
        hideLoader();
    }
}

function applyFiltersAndSort() {
    const sortOrder = document.getElementById("sortSelect").value;
    let data = showingFavorites 
        ? allUniversities.filter(uni => favorites.includes(uni.name)) 
        : allUniversities;

    const processed = [...data].sort((a, b) => 
        sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    displayUniversities(processed);
}

function displayUniversities(universities) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (universities.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.6; grid-column: 1/-1;">No results found.</p>`;
        return;
    }

    universities.forEach(uni => {
        const isFav = favorites.includes(uni.name);
        
        // 1. Create the main card element
        const card = document.createElement("div");
        card.className = "card";

        // 2. Define the inner structure (leaving out the onclick)
        card.innerHTML = `
            <button class="fav-btn">${isFav ? '❤️' : '🤍'}</button>
            <h3>${uni.name}</h3>
            <p><strong>Country:</strong> ${uni.country}</p>
            <p><strong>Domain:</strong> ${uni.domains?.[0] || "N/A"}</p>
            <a href="${uni.web_pages?.[0] || "#"}" target="_blank">🌐 Visit Website</a>
        `;

        // 3. Select the button we just made and attach the event properly
        const favBtn = card.querySelector(".fav-btn");
        favBtn.addEventListener("click", () => {
            toggleFavorite(uni.name); // No escaping needed!
        });

        container.appendChild(card);
    });
}
function toggleViewFavorites() {
    showingFavorites = !showingFavorites;
    document.getElementById("favToggle").innerText = showingFavorites ? "View All" : "View Favorites";
    applyFiltersAndSort();
}

function toggleFavorite(name) {
    if (favorites.includes(name)) favorites = favorites.filter(n => n !== name);
    else favorites.push(name);
    localStorage.setItem("uni_favs", JSON.stringify(favorites));
    applyFiltersAndSort();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    document.getElementById("themeToggle").innerText = isLight ? "🌙" : "☀️";
}

function handleSearch() {
    const name = document.getElementById("searchInput").value;
    const country = document.getElementById("countrySelect").value;
    fetchUniversities(country, name);
}

function showLoader() { document.getElementById("loader").classList.remove("hidden"); }
function hideLoader() { document.getElementById("loader").classList.add("hidden"); }
function showError(msg) { document.getElementById("results").innerHTML = msg; }

window.onload = () => {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        document.getElementById("themeToggle").innerText = "🌙";
    }
    fetchUniversities("", ""); 
};