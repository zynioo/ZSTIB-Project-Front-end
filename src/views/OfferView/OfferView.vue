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
        class="col-md-3"
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
    title: "Nie długo",
    imgSrc: "pytajnik.png",
    href: "/offer",
  },
  {
    title: "Nie Długo",
    imgSrc: "pytajnik.png",
    href: "/offer",
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
