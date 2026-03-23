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
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = (url) => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw Error("City not found. Try 'Jaipur' or 'Patna'.");
        return res.json();
      })
      .then(result => {
        setWeather(result);
        setQuery('');
        setError('');
      })
      .catch(err => setError(err.message));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`),
      () => fetchWeather(`${API.base}weather?q=Jaipur&units=${units}&APPID=${API.key}`)
    );
  }, [units]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getBG = () => {
    if (!weather.main) return 'app';
    const tempInC = units === 'metric' ? weather.main.temp : (weather.main.temp - 32) * (5/9);
    if (tempInC > 30) return 'app hot';
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('cloud')) return 'app cloudy';
    if (main.includes('rain')) return 'app rainy';
    if (main.includes('clear')) return 'app sunny';
    return 'app';
  };

  return (
    <div className={getBG()}>
      <main>
        <div className="glass-header">
          <p className="greeting">{getGreeting()}, it's {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <input 
              type="text" className="search-bar" placeholder="Search city..."
              onChange={e => setQuery(e.target.value)} value={query}
              onKeyPress={(e) => e.key === "Enter" && fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`)}
            />
            <button className="search-btn" onClick={() => fetchWeather(`${API.base}weather?q=${query}&units=${units}&APPID=${API.key}`)}>Search</button>
          </div>
          <div className="suggestions">
            {['Jaipur', 'Lucknow', 'Patna', 'Delhi'].map(city => (
              <button key={city} onClick={() => fetchWeather(`${API.base}weather?q=${city}&units=${units}&APPID=${API.key}`)}>{city}</button>
            ))}
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}
        
        {weather.main && (
          <div className="content-wrapper animate-fade-in">
            <div className="main-card">
              <div className="card-top">
                <h1 className="location">{weather.name} <span className="country-tag">{weather.sys.country}</span></h1>
                <button className="unit-toggle" onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
                  {units === 'metric' ? 'Celsius' : 'Fahrenheit'}
                </button>
              </div>

              <div className="visual-section">
                <div className="temp-display">
                  <span className="big-temp">{Math.round(weather.main.temp)}°</span>
                  <p className="description">{weather.weather[0].description}</p>
                </div>
                <img className="main-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="weather" />
              </div>

              <div className="pro-stats">
                <div className="p-stat"><span>Feels Like</span><p>{Math.round(weather.main.feels_like)}°</p></div>
                <div className="p-stat"><span>Humidity</span><p>{weather.main.humidity}%</p></div>
                <div className="p-stat"><span>Wind Speed</span><p>{weather.wind.speed} {units === 'metric' ? 'km/h' : 'mph'}</p></div>
                <div className="p-stat"><span>Pressure</span><p>{weather.main.pressure} hPa</p></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;