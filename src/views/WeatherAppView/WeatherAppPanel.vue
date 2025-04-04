<template>
  <div class="weather-app-panel-container">
    <div class="weather-app-panel">
      <div class="weather-input-container">
        <h2 class="weather-input-title">Podaj miasto</h2>
        <input
          type="text"
          v-model="city"
          placeholder="Miasto"
          class="weather-input"
        />
        <button @click="getWeather" class="weather-button">
          Sprawdź pogodę
        </button>
      </div>

      <div class="weather-results">
        <h2 class="weather-results-title" v-if="false">Wyniki</h2>
        <div class="weather-results-content">
          <WeatherAppResult
            v-if="weatherHolder"
            :cityName="city"
            :weather="weatherHolder"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import WeatherAppResult from "./WeatherAppResult.vue";
export interface IWeather {
  condition: {
    text: string;
    icon: string; // <-- Your icon URL
    code: number;
  };
  temp_c: number;
  wind_kph: number;
  humidity: number;
  cloud: number;
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
}
const city = ref<string>("");
const weatherHolder = ref<IWeather | null>(null); //set weather variable to null
const getWeather = async () => {
  try {
    const apiKey = "7b6f1fbd8d3d41bc84d91006250104";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city.value}`; //set url to fetch data from API
    const response = await fetch(url); //fetch data from API
    if (!response.ok) {
      throw new Error("Nie udalo sie pobrac danych");
    }
    const data = await response.json();
    const weather: IWeather = data.current; //set weather variable to current weather data
    //Set values to HTML elements
    console.log("weather", weather);
    weatherHolder.value = weather;
    console.log("weatherHolder", weatherHolder.value);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};
</script>

<style scoped>
.weather-app-panel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  color: white;
}

.weather-app-panel {
  display: flex;
  width: 80%;
  max-width: 800px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: #14151a;
  border-radius: 8px;
}

.weather-app-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.weather-app-description {
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #aaa;
}

.weather-input-container {
  display: flex;
  justify-content: space-around;
  align-items: center;

  width: 100%;
  margin-bottom: 1.5rem;
}

.weather-input-title {
  font-size: 1.5rem;
  color: #ccc;
}

.weather-input {
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
}

.weather-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.weather-button:hover {
  background-color: var(--primaryHover);
}

.weather-results {
  width: 100%;
  text-align: center;
}

.weather-results-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ddd;
}

.weather-results-content {
  min-height: 100px;
}
@media (max-width: 950px) {
  .weather-app-panel {
    width: 90%;
    padding: 1rem;
  }
  .weather-input-container {
    flex-direction: column;
    align-items: center;
  }
  .weather-input {
    width: 70%;
    max-width: none;
    margin-bottom: 1rem;
  }
  .weather-button {
    width: 70%;
    max-width: none;
  }
}
</style>
