<template>
  <div class="memory-panel container">
    <div class="row memory-row">
      <div class="col memory-block" v-for="number in numbers" :key="number">
        {{ number }}
      </div>
    </div>
    <div class="row memory-row">
      <div class="col memory-block" v-for="number in numbers" :key="number">
        {{ number }}
      </div>
    </div>
    <div class="row memory-row">
      <div class="col memory-block" v-for="number in numbers" :key="number">
        {{ number }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const numbers = ref<number[]>([1, 2, 3, 4]);
const colors = ref<string[]>([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
]);
const props = defineProps<{
  indexOfColors: number[];
}>();
</script>
<style scoped>
.memory-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--deepDark);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.memory-row {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.memory-block {
  background: linear-gradient(145deg, var(--lightDark), var(--dark));
  border: 2px solid var(--primary);
  border-radius: 10px;
  text-align: center;
  padding: 30px 20px;
  font-size: 26px;
  font-weight: bold;
  margin: 8px;
  color: var(--primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1 / 1;
}

.memory-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-color: var(--primaryHover);
  background: linear-gradient(145deg, var(--dark), var(--deepDark));
}

.memory-block:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-color: var(--white);
}

/* Animacja odkrywania karty - możesz dodać klasę w logice gry */
@keyframes flipCard {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
}

.flipped {
  animation: flipCard 0.5s forwards;
  background: linear-gradient(145deg, var(--primary), var(--primaryHover));
  color: var(--white);
  border-color: var(--white);
}

/* Responsywność */
@media (max-width: 768px) {
  .memory-block {
    padding: 20px 15px;
    font-size: 20px;
    margin: 5px;
  }
}

@media (max-width: 576px) {
  .memory-block {
    padding: 15px 10px;
    font-size: 18px;
    margin: 3px;
  }

  .memory-panel {
    padding: 10px;
  }
}
</style>
