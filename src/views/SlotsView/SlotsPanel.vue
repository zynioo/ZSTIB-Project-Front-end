<template>
  <div class="slots-game-panel-contaier">
    <div class="slots-blocks" v-for="number in numbers" :key="number">
      <div class="image-container" v-for="number2 in numbers" :key="number2">
        <img
          class="slots-image"
          :src="
            require(
              `../../assets/Photos/SlotsImages/slots${props.drawedNumbers[number][number2]}.png`
            )
          "
          alt="ds"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUpdated } from "vue";
const numbers = [0, 1, 2];
const props = defineProps<{
  drawedNumbers: number[][];
  spinEnded: boolean;
  isWin: boolean;
}>();

onUpdated(() => {
  const divs = document.querySelectorAll(
    ".slots-blocks:nth-child(2) .image-container"
  );
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
  flex-direction: column;
  flex-wrap: nowrap;
}

.slots-blocks {
  flex-grow: 1;
  display: flex;
  min-width: 80px;
  width: 90%;
  align-items: center;
  height: 200px;
  margin: 10px;
  font-size: 2rem;
  display: flex;
  color: white;
  padding: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid white;
}
.slots-image {
  width: 90%;
  object-fit: contain;
  height: 90%;
}

.slots-block-lose {
  border-color:  var(--lose);
}

.slots-block-win {
  border-color: var(--primary);
}

@media (max-width: 967px) {
  .slots-blocks {
    height: 230px;
  }
}

@media (max-width: 770px) {
  .slots-blocks {
    height: 170px;
  }
}

@media (max-width: 570px) {
  .slots-blocks {
    height: 80px;
  }
}

@media (max-width: 370px) {
  .slots-blocks {
    height: 80px;
  }
}
</style>
