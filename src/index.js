import "./style.css";
let currentUnit = "C";
let latestWeatherData = null;

async function getWeather(city) {
    const apiKey = "MT5FH7HGFW8JK636Z7VAF7LZD";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?key=${apiKey}&unitGroup=metric`;
     const weatherContainer = document.querySelector("#weather-container");

    weatherContainer.innerHTML = "<p>Loading weather...</p>";
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const weatherData = await response.json();

        const processedData = processWeatherData(weatherData);

        displayWeather(processedData);

    } catch (error) {
        console.error("Could not fetch weather:", error);

        weatherContainer.innerHTML = "<p>Could not fetch weather. Please try again.</p>";
    }
}

function processWeatherData(weatherData) {
    return {
        city: weatherData.resolvedAddress,
        temperature: weatherData.currentConditions.temp,
        conditions: weatherData.currentConditions.conditions,
        humidity: weatherData.currentConditions.humidity
    };
}

function displayWeather(weatherData) {
    latestWeatherData = weatherData;

    const weatherContainer = document.querySelector("#weather-container");

    let temperature = weatherData.temperature;

    if (currentUnit === "F") {
        temperature = (temperature * 9 / 5) + 32;
    }

    weatherContainer.innerHTML = `
        <h2>${weatherData.city}</h2>
        <p>Temperature: ${temperature.toFixed(1)} °${currentUnit}</p>
        <p>Conditions: ${weatherData.conditions}</p>
        <p>Humidity: ${weatherData.humidity}%</p>
    `;
}

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

const celsiusBtn = document.querySelector("#celsius-btn");
const fahrenheitBtn = document.querySelector("#fahrenheit-btn");

celsiusBtn.addEventListener("click", () => {
    currentUnit = "C";

    if (latestWeatherData) {
        displayWeather(latestWeatherData);
    }
});

fahrenheitBtn.addEventListener("click", () => {
    currentUnit = "F";

    if (latestWeatherData) {
        displayWeather(latestWeatherData);
    }
});