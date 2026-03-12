// script.js — Weather Dashboard

// =====================================================
// API KEY
// =====================================================
const API_KEY = "07426c8f52429acc79abf1998bbaf6b6";

// -------------------------------------------------------
// GRAB HTML ELEMENTS
// -------------------------------------------------------
const cityInput     = document.getElementById("cityInput");
const searchBtn     = document.getElementById("searchBtn");
const weatherCard   = document.getElementById("weatherCard");
const statusMsg     = document.getElementById("statusMsg");
const recentSection = document.getElementById("recentSearches");
const cityNameEl    = document.getElementById("cityName");
const conditionEl   = document.getElementById("conditionText");
const tempValueEl   = document.getElementById("tempValue");
const unitLabelEl   = document.getElementById("unitLabel");
const weatherIconEl = document.getElementById("weatherIcon");
const toggleUnitBtn = document.getElementById("toggleUnitBtn");

// -------------------------------------------------------
// STATE VARIABLES
// -------------------------------------------------------
let currentTempC = null;
let currentUnit  = "C";
let recentCities = [];

// -------------------------------------------------------
// ON PAGE LOAD
// -------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("recentCities");
  if (saved) {
    recentCities = JSON.parse(saved);
    renderRecentSearches();
  }
  showStatus("empty", "🌍 Enter a city name above to see the weather!");
});

// -------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
toggleUnitBtn.addEventListener("click", () => {
  currentUnit = currentUnit === "C" ? "F" : "C";
  updateTemperatureDisplay();
});

// -------------------------------------------------------
// HANDLE SEARCH
// -------------------------------------------------------
function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
}

// -------------------------------------------------------
// FETCH WEATHER
// -------------------------------------------------------
async function fetchWeather(city) {
  showStatus("loading", "⏳ Fetching weather data...");
  hideWeatherCard();

  try {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + API_KEY + "&units=metric";

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 401) {
      throw new Error("Invalid API key. Please check your API key.");
    }
    if (String(data.cod) === "404") {
      throw new Error("City not found. Please check the spelling.");
    }
    if (String(data.cod) !== "200") {
      throw new Error(data.message || "Something went wrong. Try again.");
    }

    currentTempC            = data.main.temp;
    cityNameEl.textContent  = "📍 " + data.name;
    conditionEl.textContent = data.weather[0].description;
    weatherIconEl.src       = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    weatherIconEl.alt       = data.weather[0].description;

    updateTemperatureDisplay();
    hideStatus();
    showWeatherCard();
    addToRecentCities(data.name);

  } catch (err) {
    showStatus("error-msg", "❌ " + err.message);
    hideWeatherCard();
  }
}

// -------------------------------------------------------
// TEMPERATURE TOGGLE
// -------------------------------------------------------
function updateTemperatureDisplay() {
  if (currentTempC === null) return;

  if (currentUnit === "C") {
    tempValueEl.textContent   = Math.round(currentTempC);
    unitLabelEl.textContent   = "°C";
    toggleUnitBtn.textContent = "Switch to °F";
  } else {
    tempValueEl.textContent   = Math.round((currentTempC * 9 / 5) + 32);
    unitLabelEl.textContent   = "°F";
    toggleUnitBtn.textContent = "Switch to °C";
  }
}

// -------------------------------------------------------
// RECENT SEARCHES — add, remove, clear, render
// -------------------------------------------------------
function addToRecentCities(cityName) {
  recentCities = recentCities.filter(
    (c) => c.toLowerCase() !== cityName.toLowerCase()
  );
  recentCities.unshift(cityName);
  recentCities = recentCities.slice(0, 5);
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecentSearches();
}

// Remove a single city by name
function removeRecentCity(cityName) {
  recentCities = recentCities.filter(
    (c) => c.toLowerCase() !== cityName.toLowerCase()
  );
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecentSearches();
}

// Clear the entire recent searches list
function clearAllRecent() {
  recentCities = [];
  localStorage.removeItem("recentCities");
  renderRecentSearches();
}

function renderRecentSearches() {
  if (recentCities.length === 0) {
    recentSection.classList.remove("visible");
    recentSection.innerHTML = "";
    return;
  }

  // Header: label on left, Clear All on right
  let html = '<div class="recent-header">';
  html += '<p class="recent-label">🕒 Recent Searches</p>';
  html += '<button class="clear-all-btn" onclick="clearAllRecent()">Clear All</button>';
  html += '</div>';

  // Each chip: city name (clickable) + ✕ button
  html += '<div class="recent-list">';
  recentCities.forEach(function(city) {
    html += '<div class="recent-chip">';
    html += '<span class="chip-name" onclick="clickRecentCity(\'' + city + '\')">' + city + '</span>';
    html += '<button class="chip-remove" onclick="removeRecentCity(\'' + city + '\')" title="Remove">✕</button>';
    html += '</div>';
  });
  html += '</div>';

  recentSection.innerHTML = html;
  recentSection.classList.add("visible");
}

function clickRecentCity(city) {
  cityInput.value = city;
  fetchWeather(city);
}

// -------------------------------------------------------
// HELPERS
// -------------------------------------------------------
function showStatus(type, message) {
  statusMsg.className     = "status-message " + type + " visible";
  statusMsg.textContent   = message;
  statusMsg.style.display = "";
}

function hideStatus() {
  statusMsg.style.display = "none";
}

function showWeatherCard() {
  weatherCard.style.display = "block";
}

function hideWeatherCard() {
  weatherCard.style.display = "none";
}