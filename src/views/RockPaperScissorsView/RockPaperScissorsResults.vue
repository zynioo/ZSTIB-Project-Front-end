<template>
  <div class="results-container">
    <div class="game-results">
      <img
        :src="
          require(
            `../../assets/Photos/RockPaperScissors/${options[props.userChoice as number]}.png`
          )
        "
        alt="user choice"
        class="choice"
      />
      <h2>Twoja decyzja</h2>
    </div>
    <div class="result-text">{{ result }}</div>
    <div class="game-results">
      <img
        :src="
          require(
            `../../assets/Photos/RockPaperScissors/${options[props.computerChoice as number]}.png`
          )
        "
        alt="computer choice"
        class="choice"
      />
      <h2>Decyzja komputera</h2>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  userChoice: number | null;
  computerChoice: number | null;
  result: string | null;
}>();
const options: string[] = ["rock", "paper", "scissors"];
</script>
<style scoped>
.results-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1.5rem auto;
  width: 100%;
}
.game-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--white);
    margin-top: 1rem;
  }
  .choice {
    width: 100%;
    height: auto;
    transition: transform 0.2s;
  }
}
.result-text {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin-top: 1rem;
}
@media (max-width: 960px) {
  .choice {
    max-width: 200px;
  }

  h2 {
    font-size: 1.25rem;
  }

  .result-text {
    font-size: 1.5rem;
  }
}

/* Przy bardzo wąskich ekranach przechodzimy w kolumnę */
@media (max-width: 640px) {
  .results-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .result-text {
    margin: 1rem 0;
  }
}
</style>
