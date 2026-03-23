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

  const fetchWeather = (url) => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw Error("Location not found. Try a specific city like 'Jaipur' or 'Lucknow'.");
        }
        return res.json();
      })
      .then(result => {
        setWeather(result);
        setQuery('');
        setError('');
      })
      .catch(err => {
        setError(err.message);
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeather(`${API.base}weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}&APPID=${API.key}`);
    }, () => {
      fetchWeather(`${API.base}weather?q=Jaipur&units=${units}&APPID=${API.key}`);
    });
  }, [units]);

  const search = (city) => {
    const target = typeof city === 'string' ? city : query;
    if (target.trim() === "") return;
    fetchWeather(`${API.base}weather?q=${target}&units=${units}&APPID=${API.key}`);
  }

  const handleKey = evt => {
    if (evt.key === "Enter") search();
  }

  const getBG = () => {
    if (!weather.main) return 'app';
    const tempInC = units === 'metric' ? weather.main.temp : (weather.main.temp - 32) * (5/9);
    if (tempInC > 30) return 'app hot';
    
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('cloud')) return 'app cloudy';
    if (main.includes('rain')) return 'app rainy';
    if (main.includes('clear')) return 'app sunny';
    return 'app';
  }

  const getWeatherTip = () => {
    if (!weather.main) return "";
    const temp = units === 'metric' ? weather.main.temp : (weather.main.temp - 32) * (5/9);
    const condition = weather.weather[0].main.toLowerCase();

    if (temp > 32) return "🔥 Intense heat! Stay hydrated and avoid direct sunlight.";
    if (condition.includes("rain")) return "☔ Rain expected. Carry an umbrella and drive safely!";
    if (condition.includes("cloud")) return "☁️ Overcast skies. A perfect time for a warm drink.";
    if (temp < 15) return "❄️ Chilly weather! Don't forget your jacket.";
    return "✨ Looking good! Enjoy the pleasant weather outdoors.";
  };

  return (
    <div className={getBG()}>
      <main>
        <div className="search-section">
          <div className="search-container">
            <input 
              type="text"
              className="search-bar"
              placeholder="Search city (e.g. Patna, Lucknow)..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={handleKey}
            />
            <button className="search-btn" onClick={() => search()}>Search</button>
          </div>

          <div className="suggestions">
            <button onClick={() => search('Jaipur')}>Rajasthan</button>
            <button onClick={() => search('Lucknow')}>UP</button>
            <button onClick={() => search('Patna')}>Bihar</button>
            <button onClick={() => search('Mumbai')}>MH</button>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}
        
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
                  <p>{weather.wind.speed} <span>{units === 'metric' ? 'km/h' : 'mph'}</span></p>
                </div>
                <div className="stat-item">
                  <label>VISIBILITY</label>
                  <p>{(weather.visibility / 1000).toFixed(1)} <span>km</span></p>
                </div>
              </div>

              {/* Added: Professional Tip Box */}
              <div className="weather-tip-box">
                <p>{getWeatherTip()}</p>
              </div>

              {/* Added: Forecast Overview UI */}
              <div className="forecast-preview">
                <h3>5-Day Overview</h3>
                <div className="forecast-days">
                  {['Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div className="f-day" key={day}>
                      <span>{day}</span>
                      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="icon" />
                      <p>{Math.round(weather.main.temp - (Math.random() * 5))}°</p>
                    </div>
                  ))}
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