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
        alert("City not found!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }

  return (
    <div className="App">
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search for a city..."
            onChange={e => setCity(e.target.value)}
            value={city}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {weather && (
          <div className="location-container">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
            
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="weather">
                {weather.weather[0].main}
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt="weather-icon" 
                />
              </div>
              <div className="details">
                <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
                <p>Wind: {weather.wind.speed} km/h</p>
                <p>Humidity: {weather.main.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;