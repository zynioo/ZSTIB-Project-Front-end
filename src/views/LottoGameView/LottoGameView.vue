<template>
  <section class="lotto">
    <div class="container col-xxl-10">
      <div class="row d-flex">
        <HeaderOfGame>
          <template #header>
            <h2>Symlator Lotto</h2>
          </template>
          <template #description>
            <p>
              To jeden z naszych projektów, tworzonych na lekcjach. Symuluje on
              popularną grę Lotto. Wprowadź swoje liczby i sprawdź czy wygrasz!
            </p>
          </template>
        </HeaderOfGame>
        <div class="prize-pool">
          Aktualna pula nagród: <span>{{ prizePool }}</span>
        </div>
        <!-- Lotto game simulation -->
        <LottoGamePanel
          @fetchPrizePool="fetchPrizePool"
          @incrementPrizePool="incrementPrizePool"
          @resetPrizePool="resetPrizePool"
          :prizePool="prizePool"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import HeaderOfGame from "@/components/HeaderOfGame.vue";
import LottoGamePanel from "./LottoGamePanel.vue";

const prizePool = ref<number>(0);

const fetchPrizePool = async () => {
  try {
    const response = await fetch("https://zstib-project.vercel.app/api/lotto/prize-pool");
    const data = await response.json();
    prizePool.value = parseInt(data.prizePool);
  } catch (error) {
    console.error(error);
  }
};

const incrementPrizePool = async () => {
  try {
    await fetch("https://zstib-project.vercel.app/api/lotto/increment-prize-pool", {
      method: "POST",
    });
    fetchPrizePool();
  } catch (error) {
    console.error(error);
  }
};

const resetPrizePool = async () => {
  try {
    await fetch("https://zstib-project.vercel.app/api/lotto/reset-prize-pool", {
      method: "POST",
    });
    fetchPrizePool();
    console.log("Prize pool reset");
  } catch (error) {
    console.error(error);
  }
};

fetchPrizePool();
</script>

<style scoped>
@import url(/src/assets/colors.css);

.form-container {
  margin-top: 0.5rem;
}

.nums-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 30vw;
  height: 30vw;
  background-color: var(--lightDark);
  padding: 20px;
  border-radius: 10px;
}

.numbers {
  width: 3.25vw;
  height: 3.25vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  font-size: 22px;
}

.numbers:hover {
  background-color: var(--dark);
}

.active {
  background-color: gold;
}
.prize-pool {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
}

.btn {
  margin-top: 20px;
  background: transparent;
  color: white;
  border-radius: 0;
  font-size: 1.1rem;
  font-weight: bold;
  border: 1px solid var(--primary);
  transition: 0.3s ease-in-out;
  padding: 0.7rem 1.4rem;
}

.btn:hover {
  background-color: var(--primary) !important;
  border-color: var(--dark) !important;
  color: black !important;
}
.lotto {
  margin-top: 4rem;
}
.container {
  padding-top: 0px;
  padding-bottom: 0px;
}

@media (max-width: 1400px) {
  .nums-container {
    width: 35vw;
    height: 35vw;
    padding: 15px;
  }
  .numbers {
    width: 4vw;
    height: 4vw;
    font-size: 18px;
  }
  .container {
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

@media (max-width: 1200px) {
  .nums-container {
    width: 38vw;
    height: 38vw;
    padding: 15px;
  }
  .numbers {
    width: 4.25vw;
    height: 4.25vw;
    font-size: 18px;
  }
  .container {
    padding-top: 0px;
    padding-bottom: 0px;
  }
}

@media (max-width: 990px) {
  .lotto {
    margin-top: 2rem;
  }
  .nums-container {
    width: 50vw;
    height: 50vw;
  }
  .numbers {
    width: 5.2vw;
    height: 5.2vw;
    font-size: 15px;
  }
  .container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}
@media (max-width: 768px) {
  .nums-container {
    width: 60vw;
    height: 60vw;
    padding: 12px;
  }
  .numbers {
    width: 6.5vw;
    height: 6.5vw;
    font-size: 15px;
  }
  .container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

@media (max-width: 550px) {
  .nums-container {
    width: 85vw;
    height: 85vw;
    padding: 10px;
  }
  .numbers {
    width: 9vw;
    height: 9vw;
    font-size: 14px;
  }
  .container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}
</style>
