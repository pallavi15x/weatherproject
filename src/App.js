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

  const fetchWeather = (url) => {
    fetch(url)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`);
    }, () => {
      fetchWeather(`${API.base}weather?q=London&units=${units}&APPID=${API.key}`);
    });
  }, [units]);

  const search = evt => {
    if (evt.key === "Enter" || evt.type === "click") {
      fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`);
    }
  }

  // FIXED: Removed the double declaration and fixed braces
  const getBG = () => {
    if (!weather.main) return 'app';
    
    const tempInCelsius = units === 'metric' ? weather.main.temp : (weather.main.temp - 32) * (5/9);

    // 1. Temperature Priority (Hot background for Rajasthan style heat)
    if (tempInCelsius > 30) return 'app hot';
    
    // 2. Secondary: Condition Priority
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return 'app rainy';
    if (main.includes('cloud')) return 'app cloudy';
    if (main.includes('clear')) return 'app sunny';
    if (main.includes('mist') || main.includes('haze')) return 'app misty';
    
    return 'app';
  }

  return (
    <div className={getBG()}>
      <main>
        <div className="search-container">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search city..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <button className="search-btn" onClick={search}>Search</button>
        </div>
        
        {weather.main && (
          <div className="content-wrapper animate-fade-in">
            <div className="header-section">
              <h1 className="location">{weather.name}, {weather.sys.country}</h1>
              <p className="date-display">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <button className="unit-badge" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
                {units === 'metric' ? '°C' : '°F'}
              </button>
            </div>
            
            <div className="main-card">
              <div className="temp-section">
                <span className="current-temp">{Math.round(weather.main.temp)}°</span>
                <div className="condition">
                  <img 
                    className="weather-icon" 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                    alt="icon" 
                  />
                  <p>{weather.weather[0].description}</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <label>FEELS LIKE</label>
                  <p>{Math.round(weather.main.feels_like)}°</p>
                </div>
                <div className="stat-item">
                  <label>HUMIDITY</label>
                  <p>{weather.main.humidity}%</p>
                </div>
                <div className="stat-item">
                  <label>WIND</label>
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></p>
                </div>
                <div className="stat-item">
                  <label>PRESSURE</label>
                  <p>{weather.main.pressure} <span>hPa</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;