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
  align-items: center;
  margin-top: 1rem;
  height: 100%;
  width: 100%;
  flex-wrap: nowrap;
}

.slots-block {
  flex-grow: 1;
  min-width: 80px;
  height: 350px;
  border: 1px solid white;
  margin: 10px;
  font-size: 2rem;
  color: white;
  padding: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
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

@media (max-width: 967px) {
  .slots-block {
    height: 230px;
  }
}

@media (max-width: 770px) {
  .slots-block {
    height: 170px;
  }
}

@media (max-width: 570px) {
  .slots-block {
    height: 120px;
  }
}

@media (max-width: 370px) {
  .slots-block {
    height: 80px;
  }
}
</style>
