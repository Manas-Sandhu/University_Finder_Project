const API_BASE = "http://universities.hipolabs.com/search";
let allUniversities = []; 
let favorites = JSON.parse(localStorage.getItem("uni_favs")) || [];
let showingFavorites = false; 


async function fetchUniversities(country, name) {
  let url = `${API_BASE}?name=${encodeURIComponent(name)}`;
  if (country) url += `&country=${encodeURIComponent(country)}`;

  try {
    showLoader();
    showingFavorites = false; 
    updateFavButtonUI();

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    
    const data = await response.json();
    
    allUniversities = data.filter(uni => uni.name); 
    
    applyFiltersAndSort(); 
  } catch (error) {
    showError("❌ Failed to fetch data. Please try again.");
  } finally {
    hideLoader();
  }
}


function applyFiltersAndSort() {
  const sortOrder = document.getElementById("sortSelect").value;
  
  
  let dataToProcess = showingFavorites 
    ? allUniversities.filter(uni => favorites.includes(uni.name)) 
    : allUniversities;

  
  const processedData = [...dataToProcess].sort((a, b) => {
    return sortOrder === "asc" 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name);
  });

  displayUniversities(processedData);
}


function displayUniversities(universities) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (universities.length === 0) {
    container.innerHTML = showingFavorites 
      ? "<p class='error'>You haven't added any favorites yet!</p>" 
      : "<p>No universities found.</p>";
    return;
  }

  // REQUIREMENT: .forEach() HOF
  universities.forEach((uni) => {
    const isFav = favorites.includes(uni.name);
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${uni.name.replace(/'/g, "\\'")}')">
        ${isFav ? '❤️' : '🤍'}
      </button>
      <h3>${uni.name}</h3>
      <p><strong>Country:</strong> ${uni.country}</p>
      <p><strong>Domain:</strong> ${uni.domains?.[0] || "N/A"}</p>
      <a href="${uni.web_pages?.[0] || "#"}" target="_blank">🌐 Visit Website</a>
    `;
    container.appendChild(card);
  });
}




function toggleViewFavorites() {
  showingFavorites = !showingFavorites;
  updateFavButtonUI();
  applyFiltersAndSort();
}

function updateFavButtonUI() {
  const btn = document.getElementById("favToggle");
  if (btn) {
    btn.innerText = showingFavorites ? "View All Results" : "View Favorites";
  }
}

function toggleFavorite(uniName) {
  if (favorites.includes(uniName)) {
    favorites = favorites.filter(name => name !== uniName);
  } else {
    favorites.push(uniName);
  }
  localStorage.setItem("uni_favs", JSON.stringify(favorites));
  applyFiltersAndSort();
}


function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.innerText = isLight ? "🌙" : "☀️";
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.innerText = "🌙";
  }
}


function handleSearch() {
  const searchInput = document.getElementById("searchInput").value.trim();
  const country = document.getElementById("countrySelect").value;
  fetchUniversities(country, searchInput);
}

function showLoader() { document.getElementById("loader").classList.remove("hidden"); }
function hideLoader() { document.getElementById("loader").classList.add("hidden"); }
function showError(msg) { document.getElementById("results").innerHTML = `<p class="error">${msg}</p>`; }

window.onload = () => {
  applySavedTheme();
  fetchUniversities("", ""); 
};