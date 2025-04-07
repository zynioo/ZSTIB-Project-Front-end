<template>
  <div class="weather-app-result-container">
    <div class="weather-app-result">
      <h2 class="weather-city-title">Wynik dla miasta: {{ props.cityName }}</h2>

      <div class="weather-main-box">
        <div class="weather-icon-container">
          <!-- WeatherAPI.com provides icon URLs directly in the response -->
          <img
            v-if="props.weather?.condition?.icon"
            :src="'https:' + props.weather?.condition?.icon"
            alt="Stan pogody"
            class="weather-condition-icon"
          />
          <div class="weather-condition-text">
            {{
              translateCondition(props.weather?.condition?.text) ||
              "Brak danych"
            }}
          </div>
        </div>
      </div>

      <div class="weather-properties-grid">
        <div class="weather-property-box">
          <div class="weather-property-icon">🌡️</div>
          <div class="weather-property-label">Temperatura</div>
          <div class="weather-property-value">
            {{ props.weather?.temp_c }} °C
          </div>
        </div>

        <div class="weather-property-box">
          <div class="weather-property-icon">💧</div>
          <div class="weather-property-label">Wilgotność</div>
          <div class="weather-property-value">
            {{ props.weather?.humidity }} %
          </div>
        </div>

        <div class="weather-property-box">
          <div class="weather-property-icon">💨</div>
          <div class="weather-property-label">Wiatr</div>
          <div class="weather-property-value">
            {{ props.weather?.wind_kph }} km/h
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { IWeather } from "./WeatherAppPanel.vue";
const props = defineProps<{
  weather: IWeather | null;
  cityName: string;
}>();

// Function to translate English weather conditions to Polish
const translateCondition = (condition?: string) => {
  if (!condition) return "Brak danych";

  // Map of English condition texts to Polish translations
  const translationMap: Record<string, string> = {
    Sunny: "Słonecznie",
    Clear: "Bezchmurnie",
    "Partly cloudy": "Częściowe zachmurzenie",
    Cloudy: "Pochmurno",
    Overcast: "Zachmurzenie całkowite",
    Mist: "Mgła",
    Fog: "Gęsta mgła",
    "Freezing fog": "Marznąca mgła",
    "Patchy rain possible": "Możliwe przelotne opady",
    "Patchy snow possible": "Możliwe przelotne opady śniegu",
    "Patchy sleet possible": "Możliwe przelotne opady deszczu ze śniegiem",
    "Patchy freezing drizzle possible": "Możliwa mżawka marznąca",
    "Thundery outbreaks possible": "Możliwe burze",
    "Blowing snow": "Zawieje śnieżne",
    Blizzard: "Śnieżyca",
    "Light rain": "Lekki deszcz",
    "Moderate rain": "Umiarkowany deszcz",
    "Heavy rain": "Silny deszcz",
    "Light snow": "Lekki śnieg",
    "Moderate snow": "Umiarkowany śnieg",
    "Heavy snow": "Intensywne opady śniegu",
    "Light rain shower": "Lekki przelotny deszcz",
    "Moderate or heavy rain shower": "Umiarkowany lub silny przelotny deszcz",
    "Light snow showers": "Lekkie przelotne opady śniegu",
    "Moderate or heavy snow showers":
      "Umiarkowane lub silne przelotne opady śniegu",
    "Moderate or heavy sleet": "Umiarkowany lub silny deszcz ze śniegiem",
    "Patchy light drizzle": "Miejscami lekka mżawka",
    "Light drizzle": "Lekka mżawka",
    "Freezing drizzle": "Marznąca mżawka",
    "Heavy freezing drizzle": "Silna marznąca mżawka",
    "Patchy light rain": "Miejscami lekki deszcz",
    "Moderate or heavy rain in area with thunder":
      "Burza z umiarkowanym lub silnym deszczem",
    "Patchy light snow in area with thunder": "Burza z lekkim śniegiem",
    "Moderate or heavy snow in area with thunder":
      "Burza z umiarkowanym lub silnym śniegiem",
  };

  // Return translation if available, otherwise return the original text
  return translationMap[condition] || condition;
};
</script>

<style scoped>
.weather-app-result-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.weather-app-result {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-city-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
}

.weather-main-box {
  background-color: #1e1f25;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.weather-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-condition-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
  object-fit: contain;
}

.weather-condition-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.weather-properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.weather-property-box {
  background-color: #1e1f25;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.weather-property-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.weather-property-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.weather-property-label {
  color: #7e8299;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.weather-property-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Make the grid single column on smaller screens */
@media (max-width: 600px) {
  .weather-properties-grid {
    grid-template-columns: 1fr;
  }
}
</style>
