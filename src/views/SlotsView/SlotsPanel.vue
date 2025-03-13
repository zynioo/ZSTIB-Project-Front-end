<template>
  <div class="slots-game-panel-contaier">
    <div v-for="number in numbers" class="slots-block">
      <img
        class="slots-image"
        :src="
          require(
            `../../assets/Photos/SlotsImages/slots${props.drawedNumbers[number]}.png`
          )
        "
        alt="ds"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { defineProps, computed, onUpdated } from "vue";
const numbers = [0, 1, 2];
const props = defineProps<{
  drawedNumbers: number[];
  spinEnded: boolean;
  isWin: boolean;
}>();

onUpdated(() => {
  const divs = document.querySelectorAll(".slots-block");
  if (props.spinEnded) {
    if (props.isWin) {
      divs.forEach((div) => {
        div.classList.add("slots-block-win");
      });
    } else {
      divs.forEach((div) => {
        div.classList.add("slots-block-lose");
      });
    }
  } else {
    divs.forEach((div) => {
      div.classList.remove("slots-block-win");
      div.classList.remove("slots-block-lose");
    });
  }
});
</script>
<style scoped>
.slots-game-panel-contaier {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  align-items: center;
  height: 100%;
  width: 100%;
  .slots-block {
    width: 30%;
    height: 350px;
    border: 1px solid white;
    margin: 10px;
    font-size: 2rem;
    color: white;
    padding: 0.5rem;
    text-align: center;
  }
  .slots-image {
    width: 100%;
    object-fit: contain;
    height: 100%;
  }
  .slots-block-lose {
    border-color: var(--lose);
  }
  .slots-block-win {
    border-color: var(--primary);
  }
}
@media (max-width: 967px) {
  .slots-game-panel-contaier {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .slots-block {
      width: 100%;
    }
  }
}
</style>
