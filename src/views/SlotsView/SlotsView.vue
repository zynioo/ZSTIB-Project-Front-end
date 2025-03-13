<template>
  <div class="Slots-container container col-xxl-10">
    <div class="row p-0 m-0 w-100 main-row">
      <HeaderOfGame>
        <template #header>
          <h2>Jednoręki Bandyta</h2>
        </template>
        <template #description>
          Przed tobą klasyczny jednoręki bandyta. Zagraj i sprawdź swoje
          szczęście!
        </template>
      </HeaderOfGame>
      <div class="row justify-content-center">
        <SlotsPanel
          :drawedNumbers="drawedNumbersArray"
          :spinEnded="!isSpinning"
          :isWin="isWin"
        ></SlotsPanel>
      </div>
      <div class="row">
        <div class="prize-pool">
          Stan twojego portfela: <span>{{ wallet }}</span>
        </div>
      </div>
      <div class="row justify-content-center mt-3">
        <input
          type="number"
          class="stake"
          v-model="stake"
          placeholder="Wpisz stawkę zakładu"
        />
        <button class="spin-button" @click="checkCanPlay">Zakręć</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "@/components/HeaderOfGame.vue";
import SlotsPanel from "./SlotsPanel.vue";
import { ref } from "vue";
import { check } from "prettier";
const drawedNumbersArray = ref<number[]>([0, 0, 0]);
const isSpinning = ref(false);
const wallet = ref(1000);
const stake = ref(0); // Stake for each game
const isWin = ref(false);
/**
 *This function randomizes numbers in the Slots game
 * @param delay - delay between each number change
 */
const randomizeNumbers = (delay = 10) => {
  if (delay > 500) {
    // Stop animation and set final numbers
    drawedNumbersArray.value = [
      Math.floor(Math.random() * 5) + 1,
      Math.floor(Math.random() * 5) + 1,
      Math.floor(Math.random() * 5) + 1,
    ];
    isSpinning.value = false;
    checkResults();
    return;
  }
  // Randomize numbers for animation
  drawedNumbersArray.value = [
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
  ];

  const nextDelay = delay + 30;

  setTimeout(() => randomizeNumbers(nextDelay), nextDelay);
};
/**
 * This function checks if user can play the game
 */
const checkCanPlay = () => {
  if (wallet.value < stake.value) {
    alert("Nie masz wystarczających środków na koncie");
    return false;
  }
  if (stake.value <= 0) {
    alert("Stawka musi być większa od 0");
    return false;
  }
  changeNumbers();
};
const changeNumbers = () => {
  if (isSpinning.value) return;
  isSpinning.value = true;
  isWin.value = false;

  randomizeNumbers(); // Start animation
};
/**
 * This function checks the results of the game
 */
const checkResults = () => {
  if (
    drawedNumbersArray.value[0] === drawedNumbersArray.value[1] &&
    drawedNumbersArray.value[1] === drawedNumbersArray.value[2]
  ) {
    wallet.value += stake.value;
    isWin.value = true;
  } else {
    wallet.value -= stake.value;
  }
};
</script>
<style scoped>
.Slots-container {
  margin-top: 4rem;
}
.prize-pool {
  font-size: 1.5rem;
  margin-top: 1rem;
  color: white;
  text-align: center;
}
.spin-button {
  width: 15%;
  padding: 0.5rem;
  font-size: 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
}
.spin-button:hover {
  background-color: var(--primaryHover);
}
.stake {
  width: 15%;
  padding: 0.5rem;
  font-size: 1.5rem;
  border: 1px solid var(--primary);
  border-radius: 5px;
  margin-right: 1rem;
}
/* Remove the arrows for input type number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
@media (max-width: 967px) {
  .Slots-container {
    justify-self: center;
    width: 90% !important;
  }
  .spin-button {
    width: 60%;
    margin: 1rem;
  }
  .stake {
    width: 60%;
    margin: 1rem;
  }
  .main-row {
    justify-content: center;
  }
}
</style>
