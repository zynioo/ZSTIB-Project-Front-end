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
          <p>Oto gra memory</p>
        </template>
      </HeaderOfGame>
    </div>
    <div class="row main-row">
      <div class="col-12">
        <MemoryPanel :indexOfColors="indexOfColors"></MemoryPanel>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import MemoryPanel from "./MemoryPanel.vue";
import { onMounted, ref } from "vue";
const indexOfColors = ref<number[]>([]);

onMounted(() => {
  while (indexOfColors.value.length < 12) {
    const randomNumber = Math.floor(Math.random() * 12);
    if (!indexOfColors.value.includes(randomNumber)) {
      indexOfColors.value.push(randomNumber);
    }
  }
});
</script>
<style scoped>
.memory-container {
  margin-top: 5rem;
}
</style>
