<template>
  <div class="memory-container container col-xxl-10">
    <div class="row title-row">
      <HeaderOfGame>
        <template #author>
          <span>Michał Zając</span>
        </template>
        <template #header>
          <h2>Memory</h2>
        </template>
        <template #description>
          <p>Oto gra memory kliknij na kartę aby ją odkryć i dopasować parę</p>
        </template>
      </HeaderOfGame>
    </div>
    <div class="row main-row">
      <div class="col-12">
        <MemoryPanel
          @gameFinished="generateRandomIndexes"
          :indexOfColors="indexOfColors"
        ></MemoryPanel>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import MemoryPanel from "./MemoryPanel.vue";
import { onMounted, ref } from "vue";
const indexOfColors = ref<number[]>([]);

const generateRandomIndexes = () => {
  indexOfColors.value = [];
  // Generate 16 unique random numbers between 0 and 15
  while (indexOfColors.value.length < 16) {
    const randomNumber = Math.floor(Math.random() * 16);
    if (!indexOfColors.value.includes(randomNumber)) {
      indexOfColors.value.push(randomNumber);
    }
  }
};

onMounted(() => {
  generateRandomIndexes();
});
</script>
<style scoped>
.memory-container {
  margin-top: 5rem;
}
</style>
