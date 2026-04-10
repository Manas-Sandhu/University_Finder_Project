# 🎓 University Explorer

A web application to search, explore, and favorite universities worldwide — built with vanilla JavaScript and a public API.

---

## 📌 Project Overview

**University Explorer** is a fully client-side web application that lets users discover universities across the globe. Users can search by name, filter by country, sort results alphabetically, save favorites, and visit official university websites — all in a clean, responsive UI with dark/light mode support.

---

## 🎯 Purpose

The goal of this project is to:

- Practice working with public APIs using the `fetch` API
- Apply JavaScript concepts like array higher-order functions (HOFs)
- Build a responsive, user-friendly UI with theme support
- Understand real-world data handling, DOM manipulation, and performance optimization
- Implement persistent state using `localStorage`

---

## 🌐 API Used

**University Domains and Names Data List API**
`http://universities.hipolabs.com/search`

This API provides:
- University names
- Country information
- Domain names
- Official website links

> A CORS proxy is used to enable cross-origin requests from deployed environments.

---

## ✨ Features

- 🔍 **Search** universities by name with debounced input (no lag while typing)
- 🌍 **Filter** universities by country using a dropdown
- 🔤 **Sort** results alphabetically — A→Z or Z→A
- ❤️ **Favorites** — save and view your favorite universities (persisted in `localStorage`)
- 🌐 **Direct links** to official university websites
- 🌙 **Dark / Light mode** toggle (preference saved in `localStorage`)
- ♻️ **Clear filters** to reset all search inputs instantly
- ⚡ **Optimized rendering** using `DocumentFragment` for fast DOM updates

---

## 🛠️ Technologies Used

- **HTML5** — structure and semantics
- **CSS3** — styling, layout, and responsive design
- **JavaScript (ES6+)** — all app logic and interactivity
- **Fetch API** — retrieving data from the university API
- **localStorage** — persisting favorites and theme preference

---

## 🧠 Concepts Implemented

- API integration using `fetch`
- Debounced search input for performance
- JSON data parsing and handling
- Array methods: `filter()`, `sort()`, `includes()`, `push()`
- DOM manipulation and `DocumentFragment` batching
- Event handling and delegation
- `localStorage` for persistent state
- Light/dark theme toggling

---

## 📁 Project Structure

```
university-finder/
│── index.html       # App structure and layout
│── style.css        # Styling, themes, and responsive design
│── script.js        # All app logic, API calls, and DOM rendering
│── README.md        # Project documentation
```

---

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/university-finder.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd university-finder
   ```

3. **Open the project**
   ```
   Open index.html in your browser
   ```

> No build tools, no dependencies, no npm install — just open and run.

---

## 🔮 Future Enhancements

- [ ] Pagination or infinite scroll for large result sets
- [ ] Display additional university details (founding year, student count, etc.)
- [ ] Improve mobile responsiveness
- [ ] Add university logo/image support
- [ ] Deploy on a custom domain

---

## 🙏 Acknowledgment

This project uses a free public API ([Hipo University Domains List](https://github.com/Hipo/university-domains-list)) for educational purposes.
````
