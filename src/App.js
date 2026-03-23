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
      .catch(() => setError("Location not found"));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=New York&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  const getIcon = (code) => `https://openweathermap.org/img/wn/${code}@4x.png`;

  return (
    <div className="app-container">
      <div className="dynamic-bg-glow"></div>
      
      <div className="glass-interface">
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar">
          <div className="brand-logo">Ω</div>
          <div className="history-stack">
            {history.map((city, i) => (
              <button key={i} className="history-btn" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
          <button className="unit-fab" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="dashboard">
          <header className="search-section">
            <div className="input-group">
              <input 
                type="text" placeholder="Explore City..." 
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
              />
              <div className="focus-border"></div>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </header>

          {weather.main && (
            <div className="content-reveal">
              <section className="hero-weather">
                <div className="tag-row">
                  <span className="badge-live">LIVE</span>
                  <span className="badge-type">{weather.weather[0].main}</span>
                </div>
                
                <h1 className="city-name">{weather.name}</h1>
                
                <div className="main-display">
                  <div className="icon-wrap">
                    <img src={getIcon(weather.weather[0].icon)} alt="weather" className="floating-icon" />
                    <h2 className="big-temp">{Math.round(weather.main.temp)}°</h2>
                  </div>
                  <div className="meta-info">
                    <p className="description">{weather.weather[0].description}</p>
                    <p className="feels-like">Feels like {Math.round(weather.main.feels_like)}°</p>
                  </div>
                </div>
              </section>

              {/* BENTO GRID DATA */}
              <section className="bento-grid">
                <div className="bento-item">
                  <label>WIND SPEED</label>
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></p>
                  <div className="wind-compass" style={{transform: `rotate(${weather.wind.deg}deg)`}}>↑</div>
                </div>
                
                <div className="bento-item">
                  <label>HUMIDITY</label>
                  <p>{weather.main.humidity}%</p>
                  <div className="progress-bar"><div style={{width: `${weather.main.humidity}%`}}></div></div>
                </div>

                <div className="bento-item">
                  <label>VISIBILITY</label>
                  <p>{(weather.visibility / 1000).toFixed(1)} <span>km</span></p>
                </div>

                <div className="bento-item">
                  <label>PRESSURE</label>
                  <p>{weather.main.pressure} <span>hPa</span></p>
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