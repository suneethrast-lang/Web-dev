/**
 * The Bauphiloné — Dynamic Weather Feature
 * Fetches live weather from Open-Meteo API based on selected destination.
 */

'use strict';

const cityCoordinates = {
  "Mumbai, India": { latitude: 19.0760, longitude: 72.8777 },
  "New Delhi, India": { latitude: 28.6139, longitude: 77.2090 },
  "Dubai, UAE": { latitude: 25.2048, longitude: 55.2708 },
  "Paris, France": { latitude: 48.8566, longitude: 2.3522 },
  "Maldives": { latitude: 4.1755, longitude: 73.5093 },
  "Singapore": { latitude: 1.3521, longitude: 103.8198 }
};

document.addEventListener('DOMContentLoaded', () => {
  const destinationSelect = document.getElementById('destination');
  
  // Initial fetch (default to Mumbai if nothing selected)
  let initialCity = "Mumbai, India";
  
  if (destinationSelect) {
    destinationSelect.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex].text;
      if (cityCoordinates[selectedOption]) {
        updateWeatherWithAnimation(selectedOption);
      }
    });
    
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex]?.text;
    if (cityCoordinates[selectedOption]) {
        initialCity = selectedOption;
    }
  }
  
  updateWeatherWithAnimation(initialCity);
});

async function updateWeatherWithAnimation(cityName) {
  const weatherCard = document.querySelector('.weather-info');
  if (!weatherCard) return;

  // Add fade-out class
  weatherCard.classList.add('fade-out');
  
  // Wait for fade out to complete
  setTimeout(async () => {
    await fetchWeather(cityName);
    // Remove fade-out class to fade back in
    weatherCard.classList.remove('fade-out');
  }, 300);
}

async function fetchWeather(cityName) {
  const coords = cityCoordinates[cityName];
  if (!coords) return;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code`;

  const tempEl = document.getElementById('temperature');
  const conditionEl = document.getElementById('condition');
  const iconEl = document.getElementById('weatherIcon');
  const locationEl = document.querySelector('.weather-location');

  if (!tempEl || !conditionEl || !iconEl || !locationEl) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API request failed');

    const data = await response.json();
    const current = data.current;

    const temp = Math.round(current.temperature_2m);
    const code = current.weather_code;

    const weatherInfo = getWeatherDetails(code);

    tempEl.textContent = `${temp}°C`;
    conditionEl.textContent = weatherInfo.text;
    iconEl.textContent = weatherInfo.icon;
    locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${cityName}`;

  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    conditionEl.textContent = 'Weather unavailable';
    tempEl.textContent = '--°C';
    iconEl.textContent = '☁️';
    locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${cityName}`;
  }
}

function getWeatherDetails(code) {
  // Map WMO weather codes to readable text and emojis
  const weatherMap = {
    0: { text: 'Clear Sky', icon: '☀️' },
    1: { text: 'Mainly Clear', icon: '☀️' },
    2: { text: 'Partly Cloudy', icon: '⛅' },
    3: { text: 'Cloudy', icon: '☁️' },
    45: { text: 'Fog', icon: '🌫️' },
    48: { text: 'Depositing Rime Fog', icon: '🌫️' },
    51: { text: 'Light Drizzle', icon: '🌧️' },
    53: { text: 'Moderate Drizzle', icon: '🌧️' },
    55: { text: 'Dense Drizzle', icon: '🌧️' },
    56: { text: 'Light Freezing Drizzle', icon: '🌧️' },
    57: { text: 'Dense Freezing Drizzle', icon: '🌧️' },
    61: { text: 'Light Rain', icon: '🌧️' },
    63: { text: 'Rain', icon: '🌧️' },
    65: { text: 'Heavy Rain', icon: '🌧️' },
    66: { text: 'Light Freezing Rain', icon: '🌧️' },
    67: { text: 'Heavy Freezing Rain', icon: '🌧️' },
    71: { text: 'Light Snow', icon: '🌨️' },
    73: { text: 'Moderate Snow', icon: '🌨️' },
    75: { text: 'Heavy Snow', icon: '🌨️' },
    77: { text: 'Snow Grains', icon: '🌨️' },
    80: { text: 'Rain Showers', icon: '🌦️' },
    81: { text: 'Heavy Rain Showers', icon: '🌧️' },
    82: { text: 'Violent Rain Showers', icon: '⛈️' },
    85: { text: 'Snow Showers', icon: '🌨️' },
    86: { text: 'Heavy Snow Showers', icon: '🌨️' },
    95: { text: 'Thunderstorm', icon: '⛈️' },
    96: { text: 'Thunderstorm with Hail', icon: '⛈️' },
    99: { text: 'Heavy Thunderstorm with Hail', icon: '⛈️' }
  };

  return weatherMap[code] || { text: 'Unknown', icon: '☁️' };
}
