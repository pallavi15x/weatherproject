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
        if (!res.ok) throw Error("Location unavailable");
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
      .catch(() => setError("City not found."));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=Jaipur&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  // Logic for the "Comfort Index"
  const getComfortLevel = () => {
    if (!weather.main) return "Stable";
    const hum = weather.main.humidity;
    if (hum > 70) return "Humid";
    if (hum < 30) return "Dry Air";
    return "Pleasant";
  };

  const getTimeTheme = () => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) return 'night-mode';
    return 'day-mode';
  };

  return (
    <div className={`quantum-container ${getTimeTheme()}`}>
      {/* Background Animated Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div className="glass-canvas">
        <aside className="smart-dock">
          <div className="dock-logo">Ω</div>
          <div className="dock-nav">
            {history.map((city, i) => (
              <button key={i} className="dock-btn" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.substring(0, 2).toUpperCase()}
              </button>
            ))}
          </div>
          <button className="unit-swap" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </aside>

        <main className="viewport">
          <div className="search-v5">
            <input 
              type="text" placeholder="Jump to City..." 
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
            />
            <div className="search-glow"></div>
          </div>

          {weather.main && (
            <div className="scene animate-reveal">
              <section className="hero-data">
                <div className="badge-row">
                  <span className="live-badge">LIVE</span>
                  <span className="comfort-badge">{getComfortLevel()}</span>
                </div>
                <h1 className="city-title">{weather.name}</h1>
                <div className="main-temp-wrap">
                  <h2 className="temp-num">{Math.round(weather.main.temp)}<span className="degree-symbol">°</span></h2>
                  <div className="temp-meta">
                    <p className="desc-text">{weather.weather[0].description}</p>
                    <p className="range-text">H: {Math.round(weather.main.temp_max)}° L: {Math.round(weather.main.temp_min)}°</p>
                  </div>
                </div>
              </section>

              <section className="bento-grid">
                <div className="bento-item wind">
                  <label>Wind Flow</label>
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></p>
                  <div className="wind-indicator" style={{transform: `rotate(${weather.wind.deg}deg)`}}>↑</div>
                </div>
                <div className="bento-item humidity">
                  <label>Humidity</label>
                  <p>{weather.main.humidity}%</p>
                  <div className="bar-container"><div className="bar-fill" style={{width: `${weather.main.humidity}%`}}></div></div>
                </div>
                <div className="bento-item pressure">
                  <label>Pressure</label>
                  <p>{weather.main.pressure}<span>hPa</span></p>
                </div>
                <div className="bento-item visibility">
                  <label>Visibility</label>
                  <p>{(weather.visibility / 1000).toFixed(1)}<span>km</span></p>
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