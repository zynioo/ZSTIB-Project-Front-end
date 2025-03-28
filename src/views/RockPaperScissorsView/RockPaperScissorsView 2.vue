<template>
  <div class="rock-paper-scissors-container">
    <div class="rock-paper-scissors-header">
      <HeaderOfGame>
        <template #header>
          <h2>Kamień Papier Nozyce</h2>
        </template>
        <template #description>
          <p>
            Wybierz jedną z opcji i sprawdź czy wygrasz z komputerem!
            <br />
            Kamień bije nożyce, nożyce biją papier, papier bije kamień
          </p>
        </template>
      </HeaderOfGame>
    </div>
    <div class="rock-paper-scissors-game">
      <RockPaperScissorsPanel
        v-if="isPlaying"
        @selected="setValues"
      ></RockPaperScissorsPanel>
      <RockPaperScissorsResults
        v-if="!isPlaying"
        :userChoice="userChoice"
        :computerChoice="computerChoice"
        :result="result"
      ></RockPaperScissorsResults>
      <button v-if="isPlaying" class="r-p-s-button" @click="playGame">
        Zagraj
      </button>
      <button v-else class="r-p-s-button" @click="playAgain">
        Zagraj ponownie
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import RockPaperScissorsPanel from "./RockPaperScissorsPanel.vue";
import RockPaperScissorsResults from "./RockPaperScissorsResults.vue";
import { ref } from "vue";
const userChoice = ref<number | null>(null);
const computerChoice = ref<number | null>(null);
const result = ref<string | null>(null);
const isPlaying = ref(true);
/**
 * This function is used to set the values of the user and computer choices
 * @param value - number of the selected image
 */
const setValues = (value: number) => {
  userChoice.value = value;
  computerChoice.value = Math.floor(Math.random() * 3);
  console.log("userChoice", userChoice.value);
  console.log("computerChoice", computerChoice.value);
};
const playGame = () => {
  if (userChoice.value === null) {
    alert("Wybierz opcję!");
    return;
  }
  if (userChoice.value === computerChoice.value) {
    result.value = "Remis!";
  } else if (
    (userChoice.value === 0 && computerChoice.value === 2) ||
    (userChoice.value === 1 && computerChoice.value === 0) ||
    (userChoice.value === 2 && computerChoice.value === 1)
  ) {
    result.value = "Wygrałeś!";
  } else {
    result.value = "Przegrałeś!";
  }
  isPlaying.value = false;
};
const playAgain = () => {
  userChoice.value = null;
  computerChoice.value = null;
  result.value = null;
  isPlaying.value = true;
};
</script>
<style>
.rock-paper-scissors-container {
  display: flex;
  flex-direction: column;
  margin: 5rem;
  .rock-paper-scissors-game {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    height: 100%;
    width: 100%;
    flex-direction: column;
  }
}
.r-p-s-button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
@media (max-width: 768px) {
  .rock-paper-scissors-container {
    margin-left: 2rem;
    margin-right: 2rem;
  }
  .r-p-s-button {
    width: 90%;
    font-size: 1.5rem;
    padding: 15px;
  }
}
</style>
