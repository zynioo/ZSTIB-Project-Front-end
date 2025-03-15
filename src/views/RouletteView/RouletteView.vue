<template>
  <div class="roulette-container container col-xxl-10">
    <div class="row p-0 m-0 w-100 main-row">
      <HeaderOfGame>
        <template #header>
          <h2>Ruletka</h2>
        </template>
        <template #description>
          Oto klasyczna ruletka. Zagraj i sprawdź swoje szczęście!
          <br />
          Wybierz jedno lub wiele dostępnych opcji, a następnie postaw zakład
          <br />
          Możesz wybrać kolor, parzystość, zakres liczb lub pojedynczą liczbę!
        </template>
      </HeaderOfGame>
      <RouletteTableView
        :chooseOption="chooseOption"
        :numbers="numbers"
      ></RouletteTableView>
      <div class="stakeContainer">
        <div class="moneyDiv">
          <span class="money">Twoja gotówka: {{ money }}</span>
          <input
            class="stakeInput"
            type="number"
            placeholder="Stawka"
            ref="stakeInput"
            min="0"
            @input="
              stakeValue = $event.target
                ? +($event.target as HTMLInputElement).value
                : 0;
              if (stakeValue < 0) {
                stakeValue = 0;
              }
              if (
                error.valueOf() == 'Wprowadź stawkę!' ||
                error.valueOf() == 'Nie masz wystarczająco gotówki!'
              ) {
                error = '';
              }
            "
          />
        </div>
        <div class="buttonsDiv">
          <button class="buttonSubmit" @click="addBet" :disabled="isSpinning">
            Zatwierdź zakład
          </button>
          <button
            class="buttonSubmit"
            :disabled="bet.length === 0 || isSpinning"
            @click="playRoulette"
          >
            Zakręć ruletką
          </button>
        </div>
      </div>
      <div class="chosenOption">
        <div class="center error" v-if="error">{{ error }}</div>
        <div class="center" v-if="!isSpinning && currentBet !== ''">
          Wybrana opcja: {{ currentBet != "" ? currentBet : "brak" }}
        </div>
        <div class="center" v-if="!isSpinning && stakeValue > 0">
          Stawka: {{ stakeValue > 0 ? stakeValue : "nie wybrano" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "@/components/HeaderOfGame.vue";
import RouletteTableView from "@/views/RouletteView/RouletteTableView.vue";
import { ref } from "vue";

const error = ref<string>("");

const money = ref<number>(1000);

const stakeInput = ref<HTMLInputElement | null>(null);
const stakeValue = ref<number>(0);
const bet: { type: string; value: number }[] = [];
const currentBet = ref<string>("");

const isSpinning = ref<boolean>(false);

const addBet = () => {
  if (stakeInput.value === null) {
    error.value = "Wprowadź stawkę!";
    return;
  }
  if (stakeValue.value === 0) {
    error.value = "Wprowadź stawkę!";
    return;
  }
  if (currentBet.value === "") {
    error.value = "Wybierz opcję!";
    return;
  }
  if (money.value < stakeValue.value) {
    error.value = "Nie masz wystarczająco gotówki!";
    return;
  }
  money.value -= stakeValue.value;
  bet.push({ type: currentBet.value, value: stakeValue.value });

  const chosenOption = document.querySelector(".chosen");
  if (chosenOption) {
    chosenOption.classList.remove("chosen");
  }
  stakeInput.value!.value = "";
  currentBet.value = "";
  stakeValue.value = 0;
  console.log(bet);
};

const chooseOption = (option: string) => {
  currentBet.value = option;
  if (error.value === "Wybierz opcję!") {
    error.value = "";
  }
};

const playRoulette = async () => {
  isSpinning.value = true;
  const winningNumber = await spinRoulette();

  const winningNumberObj = numbers.value.find(
    (num) => num.number === winningNumber
  );

  bet.forEach((bet) => {
    let prize = 0;

    const number = winningNumberObj?.number as number;
    const color = winningNumberObj?.color;

    switch (bet.type) {
      case "czarne":
        if (color === "black") prize = bet.value * 2;
        break;
      case "czerwone":
        if (color === "red") prize = bet.value * 2;
        break;
      case "nieparzyste":
        if (number % 2 !== 0) prize = bet.value * 2;
        break;
      case "parzyste":
        if (number % 2 === 0) prize = bet.value * 2;
        break;
      case "1 - 18":
        if (number >= 1 && number <= 18) prize = bet.value * 2;
        break;
      case "19 - 36":
        if (number >= 19 && number <= 36) prize = bet.value * 2;
        break;
      case "1 - 12":
        if (number >= 1 && number <= 12) prize = bet.value * 3;
        break;
      case "13 - 24":
        if (number >= 13 && number <= 24) prize = bet.value * 3;
        break;
      case "25 - 36":
        if (number >= 25 && number <= 36) prize = bet.value * 3;
        break;
      case "rząd 1":
        if (number % 3 === 0) prize = bet.value * 3;
        break;
      case "rząd 2":
        if (number % 3 === 2) prize = bet.value * 3;
        break;
      case "rząd 3":
        if (number % 3 === 1) prize = bet.value * 3;
        break;
      default:
        if (bet.type === number.toString()) {
          prize = bet.value * 36;
        }
        break;
    }

    if (prize > 0) {
      money.value += prize;
    }
  });

  bet.length = 0;
  isSpinning.value = false;
};

const spinRoulette = (): Promise<number> => {
  return new Promise<number>((resolve) => {
    const numberCells = document.querySelectorAll(".numberCell");

    const duration = Math.random() * 10000 + 8000;
    const endTime = Date.now() + duration;
    let waitTime = 10;
    let currentIndex = 0;

    const changeColor = () => {
      if (Date.now() >= endTime) {
        (numberCells[currentIndex] as HTMLElement).style.backgroundColor =
          "yellow";

        if (currentIndex > 0) {
          (numberCells[currentIndex - 1] as HTMLElement).style.backgroundColor =
            "#007b41";
        } else {
          (
            numberCells[numberCells.length - 1] as HTMLElement
          ).style.backgroundColor = "#007b41";
        }

        const winningNumber = parseInt(
          numberCells[currentIndex].getAttribute("value") as string
        );
        resolve(winningNumber);
        return;
      }

      if (currentIndex > 0) {
        (numberCells[currentIndex - 1] as HTMLElement).style.backgroundColor =
          "#007b41";
      } else {
        (
          numberCells[numberCells.length - 1] as HTMLElement
        ).style.backgroundColor = "#007b41";
      }

      (numberCells[currentIndex] as HTMLElement).style.backgroundColor =
        "yellow";

      currentIndex = (currentIndex + 1) % numberCells.length;

      setTimeout(changeColor, waitTime);
      waitTime *= 1.0315;
    };

    changeColor();
  });
};

const numbers = ref([
  { number: 0, color: "green" },
  { number: 3, color: "red" },
  { number: 2, color: "black" },
  { number: 1, color: "red" },
  { number: 6, color: "black" },
  { number: 5, color: "red" },
  { number: 4, color: "black" },
  { number: 9, color: "red" },
  { number: 8, color: "black" },
  { number: 7, color: "red" },
  { number: 12, color: "red" },
  { number: 11, color: "black" },
  { number: 10, color: "black" },
  { number: 15, color: "black" },
  { number: 14, color: "red" },
  { number: 13, color: "black" },
  { number: 18, color: "red" },
  { number: 17, color: "black" },
  { number: 16, color: "red" },
  { number: 21, color: "red" },
  { number: 20, color: "black" },
  { number: 19, color: "red" },
  { number: 24, color: "black" },
  { number: 23, color: "red" },
  { number: 22, color: "black" },
  { number: 27, color: "red" },
  { number: 26, color: "black" },
  { number: 25, color: "red" },
  { number: 30, color: "red" },
  { number: 29, color: "black" },
  { number: 28, color: "black" },
  { number: 33, color: "black" },
  { number: 32, color: "red" },
  { number: 31, color: "black" },
  { number: 36, color: "red" },
  { number: 35, color: "black" },
  { number: 34, color: "red" },
]);
</script>
<style scoped>
.roulette-container {
  margin-top: 5rem;
}
.stakeContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  height: auto;
}
.stakeContainer * {
  box-sizing: border-box;
}
.moneyDiv,
.buttonDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.money {
  color: white;
  width: 200px;
  margin: 0 0.5rem;
  padding-inline: 6px;
}
.stakeInput {
  width: 200px;
  height: 45px;
  border-radius: 5px;
  border: 1px solid #000;
  padding: 0 10px;
  background-color: #007b41;
  color: white;
  margin: 0 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.123);
  transition: all 0.2s ease;
}
.stakeInput::placeholder {
  color: rgba(255, 255, 255, 0.822);
}
.stakeInput:focus {
  outline: none;
  background-color: #005f2f;
  box-shadow: 0 0 12px 0 rgba(255, 255, 255, 0.123);
}
.stakeInput[type="number"]::-webkit-inner-spin-button,
.stakeInput[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.buttonSubmit {
  width: 200px;
  height: 45px;
  border-radius: 5px;
  border: 1px solid #000;
  background-color: #007b41;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.123);
  position: relative;
  overflow: hidden;
}

.buttonSubmit:hover {
  background-color: #005f2f;
}

.buttonSubmit:disabled {
  background-color: #005f30c0;
  cursor: default;
}

.buttonSubmit:focus {
  outline: none;
}

.buttonSubmit:active {
  transform: scale(0.95);
  box-shadow: 0 0 15px 0 rgba(255, 255, 255, 0.3);
}

.buttonSubmit:active::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}
.buttonSubmit:disabled:active::before {
  display: none;
}
.buttonSubmit:disabled:active {
  transform: scale(1);
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.123);
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.chosenOption {
  width: 100%;
  color: white;
  font-size: 18px;
  margin-top: 1rem;
}
.center {
  text-align: center;
}
.error {
  color: red;
  font-size: 24px;
}
</style>
