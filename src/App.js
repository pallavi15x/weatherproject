import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const API_KEY = "fce63951ce2965310ed2e314e200d62f"; 

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert("City not found. Please check the spelling!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)} 
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {weather && (
          <div className="weather-card">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <p className="temp">{Math.round(weather.main.temp)}°C</p>
            <p className="desc">{weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;