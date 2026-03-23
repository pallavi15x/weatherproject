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

  const fetchWeather = (url, cityName) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw Error("City not found");
        return res.json();
      })
      .then(result => {
        setWeather(result);
        if (cityName && !history.includes(cityName)) {
          const newHistory = [cityName, ...history.filter(h => h !== cityName)].slice(0, 5);
          setHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
        setQuery('');
        setError('');
      })
      .catch(() => setError("Invalid Location"));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=New York&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  return (
    <div className="pro-app-container">
      <div className="orb-bg"></div>
      
      <div className="main-interface glass-morphism">
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar-nav">
          <div className="logo-box">Ω</div>
          <div className="history-dock">
            {history.map((city, i) => (
              <button key={i} className="dock-btn" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.charAt(0)}
              </button>
            ))}
          </div>
          <button className="settings-btn" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </aside>

        {/* CONTENT AREA */}
        <main className="content-body">
          <header className="content-header">
            <div className="search-wrapper">
              <input 
                type="text" placeholder="Jump to City..." 
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
              />
              <div className="search-line"></div>
            </div>
            {error && <span className="error-tag">{error}</span>}
          </header>

          {weather.main && (
            <div className="dashboard-content animate-in">
              <section className="hero-section">
                <div className="weather-status-row">
                  <span className="badge red">LIVE</span>
                  <span className="badge blue">{weather.weather[0].main}</span>
                </div>
                <h1 className="location-name">{weather.name}</h1>
                
                <div className="hero-visual">
                  <div className="temp-master-box">
                    <span className="temp-val">{Math.round(weather.main.temp)}°</span>
                    <div className="temp-sub">
                      <p className="condition-text">{weather.weather[0].description}</p>
                      <p className="min-max">H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* STATS BENTO GRID */}
              <section className="bento-grid-v2">
                <div className="grid-card">
                  <label>WIND FLOW</label>
                  <div className="card-val">{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></div>
                  <div className="wind-icon" style={{transform: `rotate(${weather.wind.deg}deg)`}}>↑</div>
                </div>
                <div className="grid-card">
                  <label>HUMIDITY</label>
                  <div className="card-val">{weather.main.humidity}%</div>
                  <div className="progress-track"><div className="progress-thumb" style={{width: `${weather.main.humidity}%`}}></div></div>
                </div>
                <div className="grid-card">
                  <label>PRESSURE</label>
                  <div className="card-val">{weather.main.pressure}<span>hPa</span></div>
                </div>
                <div className="grid-card">
                  <label>VISIBILITY</label>
                  <div className="card-val">{(weather.visibility / 1000).toFixed(1)}<span>km</span></div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;