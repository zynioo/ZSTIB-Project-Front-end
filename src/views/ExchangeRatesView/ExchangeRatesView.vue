<template>
  <section class="nbp-view container py-5">
    <HeaderOfGame>
      <template #header>
        <h2>Kursy Walut NBP</h2>
      </template>
      <template #author>
        <span>Maciej Smoleń</span>
      </template>
      <template #description>
        <p>
          Sprawdź aktualne kursy walut Narodowego Banku Polskiego i przeliczaj
          kwoty między różnymi walutami. Dane aktualizowane są automatycznie
          zgodnie z publikacją NBP.
        </p>
      </template>
    </HeaderOfGame>

    <div class="row">
      <ExchangeRatesPanel />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import ExchangeRatesPanel from "./EchangeRatesPanel.vue";
onMounted(() => {
  document.title = "Kursy Walut NBP";
});
</script>

<style scoped>
.nbp-view {
  margin-top: 4rem;
}
</style>
