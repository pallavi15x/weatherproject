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
          const newHistory = [cityName, ...history.filter(h => h !== cityName)].slice(0, 4);
          setHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
        setQuery('');
        setError('');
      })
      .catch(() => setError("Location Error"));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=London&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  return (
    <div className="app-viewport">
      <div className="bg-glow"></div>
      
      <div className="main-wrapper">
        {/* REFINED SIDEBAR */}
        <nav className="side-dock">
          <div className="app-logo">Ω</div>
          <div className="nav-history">
            {history.map((city, i) => (
              <button key={i} className="nav-item" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.charAt(0)}
              </button>
            ))}
          </div>
          <button className="unit-toggle" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </nav>

        {/* MAIN VIEWPORT */}
        <section className="display-area">
          <header className="header-bar">
            <div className="search-field">
              <input 
                type="text" placeholder="Search City..." 
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
              />
              <span className="search-focus-line"></span>
            </div>
          </header>

          {weather.main && (
            <div className="data-layout animate-fade">
              <div className="hero-data">
                <div className="status-tags">
                  <span className="tag-live">LIVE</span>
                  <span className="tag-desc">{weather.weather[0].main}</span>
                </div>
                <h1 className="city-headline">{weather.name}</h1>
                <div className="temp-display">
                  <span className="temp-main">{Math.round(weather.main.temp)}°</span>
                  <div className="temp-details">
                    <p className="sub-desc">{weather.weather[0].description}</p>
                    <p className="sub-range">H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°</p>
                  </div>
                </div>
              </div>

              {/* BENTO RESPONSIVE GRID */}
              <div className="bento-grid">
                <div className="bento-card">
                  <label>Wind</label>
                  <h3>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></h3>
                </div>
                <div className="bento-card">
                  <label>Humidity</label>
                  <h3>{weather.main.humidity}%</h3>
                  <div className="mini-progress"><div style={{width: `${weather.main.humidity}%`}}></div></div>
                </div>
                <div className="bento-card">
                  <label>Pressure</label>
                  <h3>{weather.main.pressure}<span>hPa</span></h3>
                </div>
                <div className="bento-card">
                  <label>Visibility</label>
                  <h3>{(weather.visibility / 1000).toFixed(1)}<span>km</span></h3>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;