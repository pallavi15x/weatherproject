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
  const [alert, setAlert] = useState(null);

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
      .catch(() => setError("Invalid Location"));
  }

  // Effect for Unit Change & Initial Load
  useEffect(() => {
    if (weather.name) {
      fetchWeather(`${API.base}weather?q=${weather.name}&units=${units}&APPID=${API.key}`);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
        () => fetchWeather(`${API.base}weather?q=London&units=${units}&APPID=${API.key}`)
      );
    }
  }, [units]);

  // Alert Logic
  useEffect(() => {
    if (weather.main) {
      const temp = weather.main.temp;
      const condition = weather.weather[0].main;
      if (temp > 38 || temp > 100 && units === 'imperial') setAlert("Extreme Heat Warning");
      else if (condition.includes("Storm")) setAlert("Severe Storm Warning");
      else setAlert(null);
    }
  }, [weather, units]);

  return (
    <div className="app-viewport">
      <div className="main-wrapper">
        {/* SIDE DOCK */}
        <nav className="side-dock">
          <div className="app-logo">Ω</div>
          <div className="nav-history">
            {history.map((city, i) => (
              <button key={i} className="nav-item" onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>
                {city.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
          <button className="unit-toggle" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </nav>

        {/* DISPLAY AREA */}
        <main className="display-area">
          {alert && <div className="alert-toast">⚠️ {alert}</div>}
          
          <div className="search-box">
            <input 
              type="text" placeholder="Search City..." 
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`, query)}
            />
          </div>

          {weather.main && (
            <div className="weather-data animate-fade">
              <section className="hero">
                <h1 className="city-name">{weather.name}</h1>
                <div className="temp-group">
                  <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
                  <span className="big-temp">{Math.round(weather.main.temp)}°</span>
                </div>
                <p className="condition">{weather.weather[0].description}</p>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <label>Wind</label>
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'm/s' : 'mph'}</span></p>
                </div>
                <div className="stat-card">
                  <label>Humidity</label>
                  <p>{weather.main.humidity}%</p>
                </div>
                <div className="stat-card">
                  <label>Pressure</label>
                  <p>{weather.main.pressure} <span>hPa</span></p>
                </div>
                <div className="stat-card">
                  <label>Visibility</label>
                  <p>{(weather.visibility / 1000).toFixed(1)} <span>km</span></p>
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