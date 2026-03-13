import { useState, useEffect } from "react";

const API_KEY = "07426c8f52429acc79abf1998bbaf6b6";

export default function App() {
  const [city, setCity]             = useState("");
  const [weather, setWeather]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [unit, setUnit]             = useState("C");
  const [recentCities, setRecentCities] = useState([]);

  // Load recent cities from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("recentCities");
    if (saved) setRecentCities(JSON.parse(saved));
  }, []);

  // Convert temperature based on current unit
  function displayTemp(tempC) {
    if (unit === "C") return `${Math.round(tempC)}°C`;
    return `${Math.round((tempC * 9) / 5 + 32)}°F`;
  }

  // Toggle between Celsius and Fahrenheit
  function toggleUnit() {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  }

  // Add city to recent list — no duplicates, max 5
  function addToRecent(cityName) {
    setRecentCities((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      const updated = [cityName, ...filtered].slice(0, 5);
      localStorage.setItem("recentCities", JSON.stringify(updated));
      return updated;
    });
  }

  // Remove a single city from recent list
  function removeCity(cityName) {
    setRecentCities((prev) => {
      const updated = prev.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      localStorage.setItem("recentCities", JSON.stringify(updated));
      return updated;
    });
  }

  // Clear all recent cities
  function clearAll() {
    setRecentCities([]);
    localStorage.removeItem("recentCities");
  }

  // Click a recent city — fill input and search
  function handleRecentClick(cityName) {
    setCity(cityName);
    fetchWeather(cityName);
  }

  async function fetchWeather(searchCity) {
    const target = searchCity || city;
    if (!target.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(target)}&appid=${API_KEY}&units=metric`;
      const res  = await fetch(url);
      const data = await res.json();

      if (data.cod === 401) throw new Error("Invalid API key.");
      if (String(data.cod) === "404") throw new Error("City not found.");

      setWeather(data);
      addToRecent(data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>⛅ Weather App</h1>

        {/* ── Search Bar ── */}
        <div style={styles.row}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button style={styles.btn} onClick={() => fetchWeather()}>
            Search
          </button>
        </div>

        {/* ── Recent Searches ── */}
        {recentCities.length > 0 && (
          <div style={styles.recentBox}>

            {/* Header row */}
            <div style={styles.recentHeader}>
              <span style={styles.recentLabel}>🕒 Recent Searches</span>
              <button style={styles.clearAllBtn} onClick={clearAll}>
                Clear All
              </button>
            </div>

            {/* City chips — each has city name + ✕ button */}
            <div style={styles.chipRow}>
              {recentCities.map((c, index) => (
                <div key={index} style={styles.chip}>
                  {/* Click city name to search */}
                  <span
                    style={styles.chipName}
                    onClick={() => handleRecentClick(c)}
                  >
                    {c}
                  </span>
                  {/* Click ✕ to remove just this city */}
                  <button
                    style={styles.chipRemove}
                    onClick={() => removeCity(c)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ── Loading ── */}
        {loading && <p style={styles.muted}>⏳ Loading...</p>}

        {/* ── Error ── */}
        {error && <p style={styles.error}>❌ {error}</p>}

        {/* ── Weather Result ── */}
        {weather && (
          <div style={styles.result}>
            <h2 style={styles.cityName}>📍 {weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p style={styles.temp}>{displayTemp(weather.main.temp)}</p>
            <p style={styles.desc}>{weather.weather[0].description}</p>
            <button style={styles.toggleBtn} onClick={toggleUnit}>
              Switch to °{unit === "C" ? "F" : "C"}
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && !weather && (
          <p style={styles.muted}>🌍 Search a city to see the weather!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1a1a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#16213e",
    borderRadius: "16px",
    padding: "36px 32px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  },
  title: {
    color: "#ffffff",
    marginBottom: "24px",
    fontSize: "1.8rem",
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #38bdf8",
    background: "#0f3460",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  btn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#38bdf8",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },

  // ── Recent Searches ──
  recentBox: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "16px",
    textAlign: "left",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  recentLabel: {
    color: "#64748b",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  clearAllBtn: {
    background: "rgba(248,113,113,0.12)",
    color: "#f87171",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "6px",
    padding: "3px 10px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    background: "rgba(56,189,248,0.1)",
    border: "1px solid rgba(56,189,248,0.3)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  chipName: {
    color: "#38bdf8",
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "5px 10px",
    cursor: "pointer",
  },
  chipRemove: {
    background: "transparent",
    color: "rgba(56,189,248,0.5)",
    border: "none",
    borderLeft: "1px solid rgba(56,189,248,0.2)",
    padding: "5px 8px",
    fontSize: "0.7rem",
    cursor: "pointer",
  },

  // ── Weather Result ──
  result: {
    marginTop: "10px",
    color: "#fff",
  },
  cityName: {
    fontSize: "1.5rem",
    marginBottom: "4px",
  },
  temp: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#38bdf8",
    margin: "0",
  },
  desc: {
    textTransform: "capitalize",
    color: "#94a3b8",
    fontSize: "1rem",
    marginTop: "6px",
  },
  toggleBtn: {
    marginTop: "16px",
    padding: "8px 20px",
    borderRadius: "10px",
    border: "1px solid #818cf8",
    background: "transparent",
    color: "#818cf8",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  muted: {
    color: "#64748b",
    marginTop: "16px",
  },
  error: {
    color: "#f87171",
    marginTop: "16px",
  },
};