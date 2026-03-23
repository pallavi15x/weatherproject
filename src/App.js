import React, { useState, useEffect } from 'react';
import './App.css';

const API = {
  key: "fce63951ce2965310ed2e314e200d62f",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [units, setUnits] = useState('metric'); // 'metric' for C, 'imperial' for F

  const fetchWeather = (url) => {
    fetch(url)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
      });
  }

  // Auto-fetch on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`);
    }, () => {
      // Fallback to a default city if geolocation is denied
      fetchWeather(`${API.base}weather?q=London&units=${units}&APPID=${API.key}`);
    });
  }, [units]); // Refetch when units change

  const search = evt => {
    if (evt.key === "Enter" || evt.type === "click") {
      fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`);
    }
  }

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > (units === 'metric' ? 16 : 60)) ? 'app warm' : 'app') : 'app'}>
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
        
        {(typeof weather.main != "undefined") ? (
        <div className="weather-container animate-fade-in">
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <button className="unit-toggle" onClick={toggleUnits}>
              Switch to {units === 'metric' ? '°F' : '°C'}
            </button>
          </div>
          
          <div className="weather-box" onClick={toggleUnits} title="Click to toggle units">
            <div className="temp">
              {Math.round(weather.main.temp)}°{units === 'metric' ? 'c' : 'f'}
            </div>
            <div className="weather-desc">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
              <p>{weather.weather[0].description}</p>
            </div>
          </div>

          <div className="extra-info-grid">
            <div className="info-card">
              <p>Feels Like</p>
              <span>{Math.round(weather.main.feels_like)}°</span>
            </div>
            <div className="info-card">
              <p>Humidity</p>
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="info-card">
              <p>Wind</p>
              <span>{weather.wind.speed} {units === 'metric' ? 'km/h' : 'mph'}</span>
            </div>
            <div className="info-card">
              <p>Visibility</p>
              <span>{(weather.visibility / 1000).toFixed(1)} km</span>
            </div>
          </div>
        </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;