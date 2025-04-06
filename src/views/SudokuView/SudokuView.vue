<template>
  <div class="sudoku-view" v-if="windowWidth > 375">
    <div class="container col-xxl-10">
      <HeaderOfGame>
        <template #header>
          <h2>Sudoku</h2>
        </template>
        <template #author>
          <span>Maciej Smoleń</span>
        </template>
        <template #description>
          <p>
            Sudoku to gra logiczna, w której celem jest wypełnienie planszy
            liczbami od 1 do 9. Każda liczba może występować tylko raz w każdym
            wierszu, kolumnie i kwadracie 3x3. Gra rozwija umiejętności
            logicznego myślenia i koncentracji.
          </p>
        </template>
      </HeaderOfGame>
      <SudokuGame />
    </div>
  </div>

  <!-- Small Window Alert for Mobile -->
  <div v-else class="small-window">
    <div class="small-window-alert">
      <div class="rotate-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 16 16"
          class="phone-icon"
        >
          <g fill="currentColor">
            <path
              d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path d="M8 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          class="arrow"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path
              stroke-dasharray="20"
              stroke-dashoffset="20"
              d="M12 21l0 -17.5"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.2s"
                values="20;0"
              />
            </path>
            <path
              stroke-dasharray="12"
              stroke-dashoffset="12"
              d="M12 3l7 7M12 3l-7 7"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.2s"
                values="12;0"
              />
            </path>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 16 16"
          class="rotated-phone"
        >
          <g fill="currentColor">
            <path
              d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path d="M8 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          </g>
        </svg>
      </div>
      <span class="big-alert"
        >Ta gra jest dostępna na większych urządzeniach</span
      ><br />
      <span class="small-alert">Obróć urządzenie lub skorzystaj z innego</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import SudokuGame from "./SudokuGame.vue";

const windowWidth = ref(window.innerWidth);

onMounted(() => {
  document.title = "Sudoku";

  // Listen for window resize events to update responsive behavior
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.sudoku-view {
  margin-top: 4rem;
}

.game-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.logo {
  font-size: 28px;
  color: var(--accent);
  animation: pulse 2s infinite;
  filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.4));
}

/* Small Window Alert Styles */
.small-window {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  color: white;
  font-size: 24px;
}

.rotate-icon {
  text-align: center;
}

.rotated-phone {
  transform: rotate(90deg) !important;
}

.arrow {
  transform: rotate(90deg) !important;
  margin-left: 0.9rem;
  margin-right: 1.4rem;
}

.big-alert {
  font-size: 22px;
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}

.small-alert {
  font-size: 18px;
  margin-top: 10px;
  width: 100%;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
