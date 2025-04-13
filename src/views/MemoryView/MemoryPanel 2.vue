<template>
  <div class="memory-panel container">
    <div class="row memory-row" v-if="!endGame">
      <div class="game-stats">
        <div class="stats-item pairs-left">
          <div class="stats-icon">👾</div>
          <div class="stats-content">
            <div class="stats-label">Pozostało par</div>
            <div class="stats-value">{{ pairsLeft }}</div>
          </div>
        </div>
        <div class="stats-item attempts-count">
          <div class="stats-icon">🎯</div>
          <div class="stats-content">
            <div class="stats-label">Liczba prób</div>
            <div class="stats-value">{{ attemptsCount }}</div>
          </div>
        </div>
      </div>
      <div
        class="memory-block"
        v-for="(indexOfColor, index) in indexOfColors"
        :key="indexOfColor"
        :class="{
          unflipped: wasFlipped[index] && !flippedCards[index],
          flipped: flippedCards[index],
        }"
        @click="openCard(index, indexOfColor)"
      >
        <div class="card-inner">
          <div class="card-front">
            <img
              class="image-for-card"
              src="../../assets/Photos/SlotsImages/slots1.png"
              alt="Zielonka logo"
            />
          </div>
          <div
            class="card-back"
            :style="{ background: colors[indexOfColor] }"
          ></div>
        </div>
      </div>
    </div>
    <div class="row memory-row" v-else>
      <div class="win-message">
        <h2 class="win-title">Wygrałeś grę!</h2>
        <button
          class="play-again-btn"
          @click="
            () => {
              handleClick();
            }
          "
        >
          Zagraj ponownie
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "gameFinished"): void;
}>();

const colors = ref<string[]>([
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "magenta",
  "cyan",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "magenta",
  "cyan",
]);

const props = defineProps<{
  indexOfColors: number[];
}>();

// Tablica śledząca stan każdej karty (odwrócona czy nie)
const flippedCards = ref<boolean[]>(
  Array(props.indexOfColors.length).fill(false)
);

// Tablica śledząca, czy karta była kiedykolwiek odwrócona (do animacji unflipped)
const wasFlipped = ref<boolean[]>(
  Array(props.indexOfColors.length).fill(false)
);

const howManyCardsFlipped = ref<number>(0),
  flippedCardsIndexes = ref<number[]>([]),
  flippedCardsColorsIndex = ref<number[]>([]),
  pairsLeft = ref<number>(colors.value.length / 2),
  attemptsCount = ref<number>(0),
  endGame = ref<boolean>(false);

const openCard = (indexOfDiv: number, indexOfColor: number) => {
  if (howManyCardsFlipped.value >= 2) {
    // Jeśli więcej niż 2 karty są odwrócone, nie rób nic
    return;
  }
  if (flippedCards.value[indexOfDiv]) {
    // Jeśli karta jest już odwrócona, odwracamy ją z powrotem
    wasFlipped.value[indexOfDiv] = false;
    flippedCards.value[indexOfDiv] = false;
    howManyCardsFlipped.value--;
    // Usuń indeks karty z tablicy flippedCardsIndexes
    const indexToRemove = flippedCardsIndexes.value.indexOf(indexOfDiv);
    if (indexToRemove !== -1) {
      flippedCardsIndexes.value.splice(indexToRemove, 1);
      console.log(flippedCardsIndexes.value);
    }
    return;
  }
  // W przeciwnym razie odwracamy kartę
  flippedCards.value[indexOfDiv] = true;
  wasFlipped.value[indexOfDiv] = true;
  howManyCardsFlipped.value++;
  flippedCardsIndexes.value.push(indexOfDiv);
  flippedCardsColorsIndex.value.push(indexOfColor);
  if (howManyCardsFlipped.value === 2) {
    checkMatching();
  }
};

const checkMatching = () => {
  const firstCardColor = colors.value[flippedCardsColorsIndex.value[0]];
  const secondCardColor = colors.value[flippedCardsColorsIndex.value[1]];
  if (firstCardColor === secondCardColor) {
    // Jeśli karty pasują, ustaw opacity na 0
    setTimeout(() => {
      const firstCard = document.querySelectorAll(".memory-block")[
        flippedCardsIndexes.value[0]
      ] as HTMLElement;
      const secondCard = document.querySelectorAll(".memory-block")[
        flippedCardsIndexes.value[1]
      ] as HTMLElement;
      if (firstCard && secondCard) {
        firstCard.style.opacity = "0";
        firstCard.style.pointerEvents = "none";
        secondCard.style.opacity = "0";
        secondCard.style.pointerEvents = "none";
        pairsLeft.value--;
      }
    }, 1000);
    console.log("Karty pasują!");
  } else {
    console.log("Karty nie pasują!");
    // Jeśli karty nie pasują, odwróć je z powrotem
    setTimeout(() => {
      flippedCards.value[flippedCardsIndexes.value[0]] = false;
      flippedCards.value[flippedCardsIndexes.value[1]] = false;
      wasFlipped.value[flippedCardsIndexes.value[0]] = false;
      wasFlipped.value[flippedCardsIndexes.value[1]] = false;
    }, 1000);
  }
  // Resetuj zmienne pomocnicze
  attemptsCount.value++;
  setTimeout(() => {
    howManyCardsFlipped.value = 0;
    flippedCardsIndexes.value = [];
    flippedCardsColorsIndex.value = [];
    if (pairsLeft.value === 0) {
      endGame.value = true;
    }
  }, 1000);
};

const handleClick = () => {
  emit("gameFinished");
  endGame.value = false;

  // Resetowanie stanu gry
  flippedCards.value = Array(props.indexOfColors.length).fill(false);
  wasFlipped.value = Array(props.indexOfColors.length).fill(false);
  howManyCardsFlipped.value = 0;
  flippedCardsIndexes.value = [];
  flippedCardsColorsIndex.value = [];
  pairsLeft.value = colors.value.length / 2;
  attemptsCount.value = 0;

  // Przywrócenie widoczności kart (resetowanie opacity)
  setTimeout(() => {
    document.querySelectorAll(".memory-block").forEach((card) => {
      (card as HTMLElement).style.opacity = "1";
      (card as HTMLElement).style.pointerEvents = "auto";
    });
  }, 100);
};
</script>
<style scoped>
.memory-panel {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--deepDark);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.memory-row {
  display: flex !important;
  justify-content: center;
  margin-bottom: 15px;
  flex-wrap: wrap !important;
}

.memory-block {
  background: linear-gradient(145deg, var(--lightDark), var(--dark));
  border: 2px solid var(--primary);
  border-radius: 10px;
  margin: 8px;
  width: 20%;
  color: var(--primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  aspect-ratio: 1 / 1;
  perspective: 1000px; /* Dodanie perspektywy dla efektu 3D */
  position: relative;
  padding: 0;
}

.memory-block:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-color: var(--primaryHover);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.card-front {
  background: linear-gradient(145deg, var(--lightDark), var(--dark));
}

.card-back {
  transform: rotateY(180deg);
  font-size: 26px;
  font-weight: bold;
  color: var(--white);
  border-color: var(--white);
}

.image-for-card {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* Animacje dla flip */
.flipped .card-inner {
  transform: rotateY(180deg);
}

.unflipped .card-inner {
  transform: rotateY(0deg);
}

/* Styl dla ekranu zwycięstwa */
.win-message {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: fadeIn 0.8s ease-in-out;
}

.win-title {
  font-size: 42px;
  font-weight: bold;
  color: var(--white);
  margin-bottom: 30px;
  text-shadow:
    0 0 10px var(--primary),
    0 0 20px var(--primary);
  animation: pulse 2s infinite;
}

.play-again-btn {
  padding: 0.5rem;
  font-size: 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.play-again-btn:hover {
  background: var(--primaryHover);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.play-again-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

/* Styl dla statystyk gry */
.game-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 25px;
  padding: 10px 0;
  border-bottom: 2px solid var(--primary);
}

.stats-item {
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, var(--dark), var(--deepDark));
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  animation: slideIn 0.5s ease-out;
}

.stats-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.stats-icon {
  font-size: 28px;
  margin-right: 15px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-label {
  font-size: 14px;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stats-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--white);
}

.pairs-left {
  border-left: 4px solid #4caf50;
}

.attempts-count {
  border-left: 4px solid #ff9800;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsywność dla statystyk */
@media (max-width: 768px) {
  .game-stats {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .stats-item {
    width: 80%;
  }

  .win-title {
    font-size: 32px;
  }

  .play-again-btn {
    padding: 10px 20px;
    font-size: 16px;
  }

  .memory-block {
    font-size: 20px;
    margin: 5px;
  }
}

@media (max-width: 576px) {
  .memory-block {
    font-size: 18px;
    margin: 3px;
  }

  .memory-panel {
    padding: 10px;
  }
}
</style>
