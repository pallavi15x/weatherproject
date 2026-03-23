import React, { useState, useEffect } from 'react';
import './App.css';

const API = {
  key: "fce63951ce2965310ed2e314e200d62f",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  // Auto-fetch current location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetch(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&APPID=${API.key}`)
        .then(res => res.json())
        .then(result => setWeather(result));
    });
  }, []);

  const search = evt => {
    if (evt.key === "Enter" || evt.type === "click") {
      fetch(`${API.base}weather?q=${query}&units=metric&APPID=${API.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
        });
    }
  }

  const dateBuilder = (d) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
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
        <div className="weather-container">
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather-desc">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
              {weather.weather[0].main}
            </div>
          </div>

          <div className="extra-info-grid">
            <div className="info-card">
              <p>Feels Like</p>
              <span>{Math.round(weather.main.feels_like)}°c</span>
            </div>
            <div className="info-card">
              <p>Humidity</p>
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="info-card">
              <p>Wind Speed</p>
              <span>{weather.wind.speed} km/h</span>
            </div>
            <div className="info-card">
              <p>Pressure</p>
              <span>{weather.main.pressure} hPa</span>
            </div>
          </div>
        </div>
        ) : (
          <div className="loading">Detecting your location...</div>
        )}
      </main>
    </div>
  );
}

export default App;