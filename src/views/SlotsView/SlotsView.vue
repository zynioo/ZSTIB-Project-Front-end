<template>
  <div class="Slots-container container col-xxl-10">
    <div class="row p-0 m-0 w-100 main-row">
      <HeaderOfGame>
        <template #header>
          <h2>Jednoręki Bandyta</h2>
        </template>
        <template #author>
          <span>Michał Zajac</span>
        </template>
        <template #description>
          Przed tobą klasyczny jednoręki bandyta. Zagraj i sprawdź swoje
          szczęście!
          <br />
          Traf trzy takie same liczby i wygraj 3x stawkę
          <br />
          Traf trzy różne liczby i wygraj stawkę
          <br />
          Przegrasz jeśli nie trafisz żadnej z tych opcji
        </template>
      </HeaderOfGame>
      <div class="row justify-content-center">
        <SlotsPanel
          :drawedNumbers="drawedNumbersAray"
          :spinEnded="!isSpinning"
          :isWin="isWin"
        ></SlotsPanel>
      </div>
      <div class="row">
        <div class="joker-drawed" v-if="jokerDrawed">Wylosowałeś JOKERA</div>
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
        <div class="lost" v-if="lost">
          Przegrałeś wszystkie pieniądze
          <a
            class="link"
            target="_blank"
            href="https://www.youtube.com/watch?v=4Y8s4UIrqPQ&ab_channel=KrajoweBiurods.Przeciwdzia%C5%82aniaNarkomaniiKBPN"
            >Kliknij aby zasilić konto</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "@/components/HeaderOfGame.vue";
import SlotsPanel from "./SlotsPanel.vue";
import { ref } from "vue";
import confetti from "canvas-confetti";

const drawedNumbersAray = ref<number[][]>([
  [2, 2, 2],
  [2, 2, 2],
  [2, 2, 2],
]);

const isSpinning = ref(false);
const wallet = ref(1000);
const stake = ref(0); // Stake for each game
const isWin = ref(false);
const jokerDrawed = ref(false);
const lost = ref(false);
/**
 *This function randomizes numbers in the Slots game
 * @param delay - delay between each number change
 */
const randomizeNumbers = (delay = 10) => {
  if (delay > 500) {
    // set final numbers
    drawedNumbersAray.value = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1)
    );
    isSpinning.value = false;
    checkResults();
    return;
  }

  // move the last row to the top
  const newNumbers = Array.from({ length: 3 }, (_, rowIndex) => {
    if (rowIndex > 0) {
      return [...drawedNumbersAray.value[rowIndex - 1]];
    } else {
      // for the first row, generate new random numbers
      return Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1);
    }
  });

  drawedNumbersAray.value = newNumbers;

  const nextDelay = delay + 35;
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
  if (wallet.value == 0) {
    lost.value = true;
    return false;
  }
  changeNumbers();
};
const changeNumbers = () => {
  if (isSpinning.value) return;
  isSpinning.value = true;
  isWin.value = false;
  jokerDrawed.value = false;
  randomizeNumbers(); // Start animation
};
/**
 * This function checks the results of the game
 */
const checkResults = () => {
  //check super win
  if (
    drawedNumbersAray.value[0][0] == drawedNumbersAray.value[0][1] &&
    drawedNumbersAray.value[0][1] == drawedNumbersAray.value[0][2] &&
    drawedNumbersAray.value[1][0] == 2
  ) {
    wallet.value += stake.value * 5;
    isWin.value = true;
    jokerDrawed.value = true;
    launchConfetti();
  } else if (
    drawedNumbersAray.value[1][0] == drawedNumbersAray.value[1][1] &&
    drawedNumbersAray.value[1][1] == drawedNumbersAray.value[1][2]
  ) {
    wallet.value += stake.value * 3;
    isWin.value = true;
  } else if (
    drawedNumbersAray.value[1][0] != drawedNumbersAray.value[1][1] &&
    drawedNumbersAray.value[1][1] != drawedNumbersAray.value[1][2] &&
    drawedNumbersAray.value[1][0] != drawedNumbersAray.value[1][2]
  ) {
    wallet.value += stake.value;
    isWin.value = true;
  } else {
    wallet.value -= stake.value;
    if (wallet.value == 0) {
      lost.value = true;
    }
  }
};
const launchConfetti = () => {
  const duration = 15 * 1000; // 15 sekund
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Wystrzał confetti z dwóch losowych punktów
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};
</script>
<style scoped>
.Slots-container {
  margin-top: 5rem;
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
.joker-drawed {
  width: 100%;
  font-size: 2rem;
  color: var(--primary);
  text-align: center;
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
.lost {
  width: 100%;
  font-size: 1.5rem;
  color: var(--white);
  text-align: center;
  margin-top: 1rem;
  a {
    color: var(--lose);
    font-weight: medium;
    font-size: 1.8rem;
    text-decoration: none;
    cursor: pointer;
  }
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
