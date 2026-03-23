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

  // Logic to change background class
  const getBG = () => {
    if (!weather.weather) return 'app';
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('cloud')) return 'app cloudy';
    if (main.includes('rain')) return 'app rainy';
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
            <button className="unit-badge" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
              {units === 'metric' ? 'Celsius' : 'Fahrenheit'}
            </button>
          </div>
          
          <div className="main-card">
            <div className="temp-section">
              <span className="current-temp">{Math.round(weather.main.temp)}°</span>
              <div className="condition">
                <img className="weather-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
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
        )}
      </main>
    </div>
  );
}

export default App;