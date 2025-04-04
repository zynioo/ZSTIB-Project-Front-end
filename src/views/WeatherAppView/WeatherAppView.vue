<template>
  <div class="container weather-app-container">
    <HeaderOfGame>
      <template #header>
        <h2>Aplikacja pogodowa</h2>
      </template>
      <template #author>
        <span>Michał Zając</span>
      </template>
      <template #description>
        <p>
          Oto aplikacja do sprawdzania pogody, podaj nazwę miasta dla której
          chcesz sprawdzić pogodę
        </p>
      </template>
    </HeaderOfGame>
    <div class="row">
      <WeatherAppPanel />
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import WeatherAppPanel from "./WeatherAppPanel.vue";
</script>
<style scoped>
.weather-app-container {
  margin-top: 5rem;
}
</style>
