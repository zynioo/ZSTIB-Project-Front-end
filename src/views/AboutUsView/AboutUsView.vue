<template>
  <div class="carousel-container">
    <button class="arrow-button" @click="prevSlide">←</button>
    <div class="slides-wrapper">
      <div
        class="slides"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div class="slide">
          <h1 class="name">Milan Sułek</h1>
          <p class="description">
            Jestem uczniem technikum o profilu programistycznym, a moją pasją
            jest tworzenie interfejsów użytkownika oraz programowanie stron
            internetowych. Mam doświadczenie w JavaScript, HTML i CSS oraz w
            pracy z frameworkami jak Vue i Bootstrap.
          </p>
        </div>
        <div class="slide">
          <h1 class="name">Michał Zając</h1>
          <p class="description">
            Jestem uczniem technikum programistycznego, interesuję się
            programowaniem frontendowym i znam takie języki jak JavaScript, HTML
            i CSS, w tym popularne frameworki jak Vue czy Bootstrap.
          </p>
        </div>
      </div>
    </div>
    <button class="arrow-button" @click="nextSlide">→</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currentSlide = ref(0);
const totalSlides = 2;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % totalSlides;
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides;
}
</script>

<style scoped>
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 80%;
  margin: 8rem auto;
  padding: 2rem;
  box-sizing: border-box;
}

.arrow-button {
  background-color: #19222b;
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  width: 70px;
  height: 70px;
  transition:
    background 0.3s,
    transform 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.arrow-button:hover {
  background-color: #141b20;
  transform: scale(1.05);
}

.slides-wrapper {
  overflow: hidden;
  width: 80%;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  min-height: 250px;
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 100%;
}

.slide {
  min-width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 1.25rem;
  text-align: center;
}

.name {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary);
}

.description {
  font-size: 1.2rem;
  line-height: 1.7;
  color: var(--white);
  max-width: 90%;
  margin: 0 auto;
  text-align: justify;
}

@media (max-width: 768px) {
  .carousel-container {
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
  }

  .arrow-button {
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    width: 50%;
  }

  .slide {
    padding: 1.2rem;
  }

  .name {
    font-size: 1.8rem;
  }

  .description {
    font-size: 1rem;
  }
}
</style>
