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
      fetchWeather(`${API.base}weather?q=Rajasthan&units=${units}&APPID=${API.key}`);
    });
  }, [units]);

  const search = evt => {
    if (evt.key === "Enter" || evt.type === "click") {
      fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`);
    }
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > (units === 'metric' ? 16 : 60)) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-container">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search for a city..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <button className="search-btn" onClick={search}>Search</button>
        </div>
        
        {(typeof weather.main != "undefined") ? (
        <div className="content-wrapper animate-fade-in">
          <div className="header-section">
            <h1 className="location">{weather.name}, {weather.sys.country}</h1>
            <button className="unit-badge" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
              Switch to {units === 'metric' ? '°F' : '°C'}
            </button>
          </div>
          
          <div className="main-card">
            <div className="temp-section">
              <span className="current-temp">{Math.round(weather.main.temp)}°</span>
              <div className="condition">
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
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
                <p>{weather.wind.speed} {units === 'metric' ? 'km/h' : 'mph'}</p>
              </div>
              <div className="stat-item">
                <label>VISIBILITY</label>
                <p>{(weather.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>
        </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;