# ⛅ Weather Dashboard

A clean, beginner-friendly weather web app built with **pure HTML, CSS, and JavaScript** — no frameworks, no installations required. Just open and run!

---

## 📁 Project Structure

```
weather-dashboard-vanilla/
  ├── index.html     → Main HTML structure & layout
  ├── style.css      → All styles (dark glass + aurora theme)
  ├── script.js      → All JavaScript logic & API calls
  └── README.md      → You are here!
```

---

## 🚀 How to Run

### Option 1 — VS Code Live Server (Recommended)
1. Open the project folder in **VS Code**
2. Install the **Live Server** extension (search in Extensions tab)
3. Right-click `index.html` → click **"Open with Live Server"**
4. App opens at `http://127.0.0.1:5500` ✅

### Option 2 — Any Local Server
You can use any local server tool. The app must be served over `http://`
and NOT opened directly as a `file://` URL — otherwise API calls will be blocked by the browser.

---

## 🔑 API Key Setup

This app uses the **OpenWeatherMap API** (free).

1. Sign up at 👉 https://openweathermap.org/api
2. Go to **API Keys** in your dashboard
3. Copy your key
4. Open `script.js` and replace the key on line 5:

```js
const API_KEY = "your_actual_key_here";
```

> ⚠️ New API keys take **10–15 minutes** to activate after signup.

---

## ✨ Features

| Feature                        | Description                                           |
|-------------------------------|-------------------------------------------------------|
| 🔍 City Search                 | Search any city in the world by name                  |
| ⌨️ Enter Key Support           | Press Enter to search without clicking the button     |
| 🌡️ Temperature Toggle         | Switch between °C and °F instantly                    |
| 🖼️ Weather Icon               | Live icon from OpenWeatherMap matching current weather|
| 🕒 Recent Searches             | Saves last 5 searched cities                          |
| ✕ Remove Individual City      | Delete any single city from recent searches           |
| 🗑️ Clear All                  | Wipe the entire recent searches list at once          |
| 💾 Persistent Storage          | Recent searches saved in localStorage (survives refresh) |
| ⏳ Loading State               | Shows a pulsing message while fetching data           |
| ❌ Error Handling              | Shows clear message if city not found or key is invalid |
| 🌍 Empty State                 | Friendly prompt shown before first search             |
| 📱 Responsive Design           | Works on mobile, tablet, and desktop                  |

---

## 🎨 Design

- **Theme:** Deep space dark with aurora glass effect
- **Fonts:** Outfit (headings) + DM Sans (body) via Google Fonts
- **Effects:** Animated background blobs, glassmorphism cards, smooth transitions
- **Colors:**
  - Background: `#080c14`
  - Accent Blue: `#38bdf8`
  - Accent Purple: `#818cf8`
  - Error Red: `#f87171`

---

## 🧠 JavaScript Concepts Used

| Concept               | Where Used                                          |
|-----------------------|-----------------------------------------------------|
| `async / await`       | Fetching weather data from the API                  |
| `fetch()`             | Making HTTP requests to OpenWeatherMap              |
| `localStorage`        | Saving and loading recent city searches             |
| `addEventListener`    | Click, keydown events on buttons and input          |
| `forEach()`           | Looping through recent cities to render chips       |
| `JSON.parse/stringify`| Reading and writing to localStorage                 |
| DOM manipulation      | Updating text, images, classes dynamically          |
| Error handling        | `try / catch` for API errors                        |
| Template strings      | Building dynamic HTML strings                       |

---

## 🌐 API Reference

**Endpoint used:**
```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
```

**Key response fields used:**

| Field                    | Description              |
|--------------------------|--------------------------|
| `data.name`              | City name                |
| `data.main.temp`         | Temperature in Celsius   |
| `data.weather[0].description` | Weather condition   |
| `data.weather[0].icon`   | Icon code for image      |
| `data.cod`               | Response status code     |

---

## 🆘 Common Issues & Fixes

| Problem                         | Fix                                                         |
|--------------------------------|-------------------------------------------------------------|
| ❌ Invalid API key              | Wait 15 mins after signup, then check key in `script.js`   |
| ❌ City not found               | Check spelling — try English city names                     |
| App not loading / blank screen  | Make sure you're using Live Server, not opening file directly |
| Recent searches not saving      | Make sure your browser allows localStorage (not incognito)  |
| Weather icon not showing        | Check internet connection — icons load from OpenWeatherMap  |

---

## 📸 UI Layout

```
┌─────────────────────────────────┐
│         ⛅ Weather Dashboard     │
│   Real-time weather for any city │
├─────────────────────────────────┤
│  🔍 [ Search a city...  ] [Search]│
├─────────────────────────────────┤
│  🕒 RECENT SEARCHES   [Clear All]│
│  [ Mumbai ✕ ] [ London ✕ ]      │
├─────────────────────────────────┤
│  📍 Mumbai                  🌤  │
│                                 │
│        28°C                     │
│        clear sky                │
│                  [Switch to °F] │
└─────────────────────────────────┘
```

---

## 👨‍💻 Built With

- HTML5
- CSS3 (Glassmorphism, CSS Variables, Animations)
- Vanilla JavaScript (ES6+)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Google Fonts](https://fonts.google.com) — Outfit & DM Sans

---

*Built as a beginner React-to-Vanilla JS learning project.*