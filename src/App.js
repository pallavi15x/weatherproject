import React, { useState, useEffect } from 'react';
import './App.css';

const API = {
  key: "fce63951ce2965310ed2e314e200d62f",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [units, setUnits] = useState('metric');
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('searchHistory')) || []);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = (url, cityName) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw Error("Location not found");
        return res.json();
      })
      .then(result => {
        setWeather(result);
        if (cityName && !history.includes(cityName)) {
          const newHistory = [cityName, ...history.filter(h => h !== cityName)].slice(0, 6);
          setHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
        setQuery('');
        setError('');
      })
      .catch(() => setError("City not found. Try 'Jaipur'"));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=Jaipur&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  const getThemeClass = () => {
    if (!weather.main) return 'app-container default';
    const condition = weather.weather[0].main;
    if (condition === 'Clear') return 'app-container sun-theme';
    if (condition === 'Clouds') return 'app-container cloud-theme';
    if (condition === 'Rain' || condition === 'Drizzle') return 'app-container rain-theme';
    return 'app-container default';
  }

  return (
    <div className={getThemeClass()}>
      <div className="dashboard-wrapper">
        
        {/* LEFT SIDEBAR: History & Branding */}
        <aside className="glass-sidebar">
          <div className="brand-zone">
            <h2>SkyCast<span>.io</span></h2>
            <p>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <div className="history-zone">
            <label>Recent Places</label>
            <div className="history-list">
              {history.map((city, i) => (
                <button key={i} className="history-item" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                  <i className="fas fa-map-marker-alt"></i> {city}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <button className="unit-toggle-btn" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
              Switch to {units === 'metric' ? '°F' : '°C'}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          <header className="glass-header">
            <div className="greeting-text">
              <h3>{getGreeting()}</h3>
              <p>Explore the world's weather</p>
            </div>
            <div className="search-bar-v3">
              <input 
                type="text" placeholder="Search another city..." 
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
              />
              <button onClick={() => fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}>Search</button>
            </div>
          </header>

          {error && <div className="error-toast">{error}</div>}

          {weather.main && (
            <div className="weather-display animate-fade-up">
              <div className="hero-weather">
                <div className="hero-text">
                  <h1 className="main-location">{weather.name}, {weather.sys.country}</h1>
                  <span className="weather-desc">{weather.weather[0].description}</span>
                </div>
                <div className="hero-temp">
                  <span className="big-degree">{Math.round(weather.main.temp)}°</span>
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather-icon" />
                </div>
              </div>

              <div className="data-grid-v3">
                <div className="glass-tile">
                  <label>Feels Like</label>
                  <p>{Math.round(weather.main.feels_like)}°</p>
                </div>
                <div className="glass-tile">
                  <label>Humidity</label>
                  <p>{weather.main.humidity}%</p>
                </div>
                <div className="glass-tile">
                  <label>Wind Speed</label>
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></p>
                </div>
                <div className="glass-tile">
                  <label>Pressure</label>
                  <p>{weather.main.pressure} <span>hPa</span></p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;