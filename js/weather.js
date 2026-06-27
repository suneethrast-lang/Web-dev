/**
 * The Bauphiloné — Weather Feature
 * Fetches live weather for Chennai, Tamil Nadu from Open-Meteo API
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
});

async function fetchWeather() {
  // Chennai, Tamil Nadu coordinates
  const latitude = 13.0827;
  const longitude = 80.2707;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

  const tempEl = document.getElementById('temperature');
  const conditionEl = document.getElementById('condition');
  const iconEl = document.getElementById('weatherIcon');

  if (!tempEl || !conditionEl || !iconEl) return;

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

  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    conditionEl.textContent = 'Weather unavailable';
    tempEl.textContent = '--°C';
    iconEl.textContent = '☁️';
  }
}

function getWeatherDetails(code) {
  // Map WMO weather codes to readable text and emojis
  const weatherMap = {
    0: { text: 'Clear Sky', icon: '☀️' },
    1: { text: 'Mainly Clear', icon: '🌤️' },
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
