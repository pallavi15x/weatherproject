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

  const fetchWeather = (url, cityName) => {
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.cod === 200) {
          setWeather(result);
          if (cityName && !history.includes(cityName)) {
            const newHistory = [cityName, ...history.filter(h => h !== cityName)].slice(0, 4);
            setHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
          }
        }
        setQuery('');
      })
      .catch(err => console.error("Error:", err));
  }

  // This ensures that when 'units' changes, the data is updated from the API
  useEffect(() => {
    if (weather.name) {
      fetchWeather(`${API.base}weather?q=${weather.name}&units=${units}&APPID=${API.key}`);
    } else {
      fetchWeather(`${API.base}weather?q=London&units=${units}&APPID=${API.key}`);
    }
  }, [units]);

  return (
    <div className="app-container">
      <div className="glass-wrapper">
        
        {/* SIDEBAR / NAV */}
        <nav className="side-nav">
          <div className="logo-icon">W</div>
          <div className="history-stack">
            {history.map((city, i) => (
              <button key={i} className="hist-btn" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.charAt(0)}
              </button>
            ))}
          </div>
          <button className="unit-toggle" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </nav>

        {/* MAIN DASHBOARD */}
        <main className="dashboard">
          <header className="search-area">
            <input 
              type="text" 
              placeholder="Search city..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
            />
          </header>

          {weather.main && (
            <div className="weather-fade-in">
              <section className="hero-data">
                <h1 className="city-label">{weather.name}</h1>
                <div className="main-temp-row">
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather" />
                  <span className="temp-number">{Math.round(weather.main.temp)}°</span>
                </div>
                <p className="weather-desc">{weather.weather[0].description}</p>
              </section>

              <div className="bento-grid">
                <div className="bento-item">
                  <span className="label">WIND</span>
                  <p className="val">{weather.wind.speed} <small>{units === 'metric' ? 'm/s' : 'mph'}</small></p>
                </div>
                <div className="bento-item">
                  <span className="label">HUMIDITY</span>
                  <p className="val">{weather.main.humidity}%</p>
                </div>
                <div className="bento-item">
                  <span className="label">FEELS LIKE</span>
                  <p className="val">{Math.round(weather.main.feels_like)}°</p>
                </div>
                <div className="bento-item">
                  <span className="label">PRESSURE</span>
                  <p className="val">{weather.main.pressure}</p>
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