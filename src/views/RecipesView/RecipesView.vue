<template>
  <div class="recipes-container">
    <div class="recipes-header">
      <HeaderOfGame>
        <template #header>
          <h2>Kuchenne rewolucje</h2>
        </template>
        <template #author>
          <span>Milan Sułek</span>
        </template>
        <template #description>
          <p>
            Wyszukaj przepis na danie, które chcesz przygotować. Możesz
            <br />
            wyszukiwać przepisy według kategorii, składników, nazwy dania lub wybranej kuchni.
          </p>
        </template>
      </HeaderOfGame>
      <RecipesPanel />
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import RecipesPanel from "./RecipesPanel.vue";
</script>
<style>
.recipes-container {
  display: flex;
  flex-direction: column;
  margin: 5rem auto;
  width: 70%;
}

</style>
