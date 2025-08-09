const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.querySelector('.forecast-container');

const displayCurrentWeather = (data) => {
  currentWeatherEl.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
    <p>${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
  `;
};

const displayForecast = (data) => {
  forecastEl.innerHTML = "";
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  dailyData.forEach(day => {
    forecastEl.innerHTML += `
      <div class="forecast-day">
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
        <p>${day.weather[0].description}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
};

const getWeather = (city) => {
  fetch(`/api/weather?city=${city}`)
    .then(res => res.json())
    .then(data => {
      if (data.error || data.cod === "404") {
        currentWeatherEl.innerHTML = `<p class="error">${data.message || "City not found"}</p>`;
        forecastEl.innerHTML = "";
        return;
      }
      displayCurrentWeather(data.current);
      displayForecast(data.forecast);
    })
    .catch(() => {
      currentWeatherEl.innerHTML = `<p class="error">Error fetching weather</p>`;
    });
};

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            displayCurrentWeather(data.current);
            displayForecast(data.forecast);
          }
        });
    });
  }
});
