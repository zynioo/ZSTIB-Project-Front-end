<template>
  <section class="offer py-5">
    <div class="container container-work">
      <div class="row">
        <div class="col-lg-6">
          <div class="services-header">
            <div class="services-header-content">
              <hr class="line" />
              <span>Zobacz nasze</span>
            </div>
            <h2>Najlepsze projekty</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="container d-flex flex-wrap p-5">
      <OfferVueBlock
        v-for="(work, index) in works"
        :key="index"
        :title="work.title"
        :imgSrc="work.imgSrc"
        :href="work.href"
      >
      </OfferVueBlock>
    </div>
  </section>
</template>

<script setup lang="ts">
import OfferVueBlock from "./OfferVueBlock.vue";

interface Work {
  title: string;
  imgSrc: string;
  href: string;
}

const works: Work[] = [
  {
    title: "Ruletka",
    imgSrc: "RoulettePreview.png",
    href: "/roulette",
  },
  {
    title: "Jednoręki Bandyta",
    imgSrc: "SlotsPreview.png",
    href: "/slots",
  },
  {
    title: "Lotto Simulator",
    imgSrc: "LottoPreview.png",
    href: "/lotto",
  },
  {
    title: "Kamień, Papier, Nożyce",
    imgSrc: "rockPaperScissorsPreview.png",
    href: "/rockPaperScissors",
  },
  {
    title: "Kursy walut",
    imgSrc: "ExchangeRatesPreview.png",
    href: "/exchangeRates",
  },
  {
    title: "Pogoda",
    imgSrc: "WeatherPreview.png",
    href: "/weatherApp",
  },
  {
    title: "Sudoku",
    imgSrc: "SudokuPreview.png",
    href: "/sudoku",
  },
];
</script>

<style scoped>
.offer {
  margin-top: 2.5rem;
}

@media (max-width: 990px) {
  .offer {
    margin-top: 2rem;
  }
}
</style>
