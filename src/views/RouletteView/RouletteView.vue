<template>
  <div class="roulette-container container col-xxl-10" v-if="windowWidth > 768">
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
          <span class="money">Twoja gotówka: {{ money }}zł</span>
          <input
            class="stakeInput"
            type="number"
            placeholder="Stawka"
            ref="stakeInput"
            min="0"
            @input="updateStakeValue"
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
        <div class="center error" v-if="error" v-html="error"></div>
        <div class="center" v-if="!isSpinning && currentBet !== ''">
          Wybrana opcja: {{ currentBet != "" ? currentBet : "brak" }}
        </div>
        <div class="center" v-if="!isSpinning && stakeValue > 0">
          Stawka: {{ stakeValue > 0 ? stakeValue + "zł" : "nie wybrano" }}
        </div>
        <div class="center currentBid" v-if="bet.length > 0">
          <span class="currentBet">Aktualny zakład: </span>
          <span
            v-html="bet.map((b) => `${b.type} - ${b.value}zł`).join(', ')"
          ></span>
        </div>
        <div class="rouletteResult center" v-if="result.length > 0">
          Wygrane zakłady:
          <span
            v-html="result.map((r) => `${r.type} - ${r.moneyWon}zł`).join(', ')"
          >
          </span
          ><br />
        </div>
        <div class="center" v-if="playAgainButtonVisibility">
          <button class="buttonSubmit mt-1" @click="playAgain">
            Zagraj ponownie
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="small-window">
    <div class="small-window-alert">
      <div class="rotate-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 16 16"
          class="phone-icon"
        >
          <g fill="currentColor">
            <path
              d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path d="M8 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          class="arrow"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path
              stroke-dasharray="20"
              stroke-dashoffset="20"
              d="M12 21l0 -17.5"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.2s"
                values="20;0"
              />
            </path>
            <path
              stroke-dasharray="12"
              stroke-dashoffset="12"
              d="M12 3l7 7M12 3l-7 7"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.2s"
                values="12;0"
              />
            </path>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 16 16"
          class="rotated-phone"
        >
          <g fill="currentColor">
            <path
              d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path d="M8 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          </g>
        </svg>
      </div>
      <span class="big-alert">
        Ta gra jest dostępna na większych urządzeniach </span
      ><br />
      <span class="small-alert">
        Obróć urządzenie lub skorzystaj z innego
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderOfGame from "../../components/HeaderOfGame.vue";
import RouletteTableView from "./RouletteTableView.vue";
import { ref } from "vue";

const windowWidth = ref(window.innerWidth);
window.addEventListener("resize", () => {
  windowWidth.value = window.innerWidth;
});

// Reference to the stake input field in the DOM
const stakeInput = ref<HTMLInputElement | null>(null);

// Stores the error message, if any
const error = ref<string>("");

// Represents the player's current balance
const money = ref<number>(1000);

// Indicates whether the roulette is currently spinning
const isSpinning = ref<boolean>(false);

// Indicates whether the "Play Again" button should be visible
const playAgainButtonVisibility = ref<boolean>(false);

// Stores the current stake value entered by the player
const stakeValue = ref<number>(0);

// Stores the currently selected betting option
const currentBet = ref<string>("");

// Stores the list of active bets placed by the player
const bet: { type: string; value: number }[] = [];

// Stores the results of the last round, including winnings
const result: { type: string; value: number; moneyWon: number }[] = [];

/**
 * Function that updates the stake value based on the input field
 * @param event - The input event
 */
const updateStakeValue = (event: Event) => {
  stakeValue.value = event.target
    ? +(event.target as HTMLInputElement).value
    : 0;
  if (stakeValue.value < 0) {
    stakeValue.value = 0;
  }
  if (
    error.valueOf() == "Wprowadź stawkę!" ||
    error.valueOf() == "Nie masz wystarczająco gotówki!"
  ) {
    error.value = "";
  }
};

/**
 * Function that adds a new bet to the list of active bets
 */
const addBet = () => {
  // Check if the stake input field is empty or the stake value is 0
  if (stakeInput.value === null || stakeValue.value === 0) {
    error.value = "Wprowadź stawkę!";
    return;
  }

  // Check if the player has selected a betting option
  if (currentBet.value === "") {
    error.value = "Wybierz opcję!";
    return;
  }

  // Check if the player has enough money to place the bet
  if (money.value < stakeValue.value) {
    error.value = "Nie masz wystarczająco gotówki!";
    return;
  }

  // Deduct the stake value from the player's balance
  money.value -= stakeValue.value;

  // Add the new bet to the list of active bets
  bet.push({ type: currentBet.value, value: stakeValue.value });

  // Store the selected option in a variable
  const chosenOption = document.querySelector(".chosen");

  // Remove the "chosen" class from the previously selected option
  if (chosenOption) {
    chosenOption.classList.remove("chosen");
  }

  // Clear the stake input field and reset the current bet and stake value
  stakeInput.value!.value = "";
  currentBet.value = "";
  stakeValue.value = 0;
};

/**
 * Function that allows the player to choose a betting option
 * @param option - The selected betting option
 */
const chooseOption = (option: string) => {
  // Store the selected option in the currentBet variable
  currentBet.value = option;

  // Checks if the error message is set to "Wybierz opcję!" and clears it
  if (error.value === "Wybierz opcję!") {
    error.value = "";
  }
};

/*Main function that simulates the roulette spinning
 * and calculates the winnings based on the player's bets
 */
const playRoulette = async () => {
  // Prevent the player from placing new bets while the roulette is spinning
  isSpinning.value = true;

  // Simulate the roulette spinning and get the winning number
  const winningNumber = await spinRoulette();

  // Find the winning number object in the numbers array
  const winningNumberObj = numbers.value.find(
    (num) => num.number === winningNumber
  );

  // Calculate the results of the round based on the winning number and color
  getResults(winningNumberObj as { number: number; color: string });

  // Reset the list of active bets
  bet.length = 0;
};

/**
 * Function that calculates the results of the round
 * based on the winning number and color
 * @param winningNumberObj - Object containing the winning number and color
 */
const getResults = (winningNumberObj: { number: number; color: any }) => {
  // Iterate over the list of active bets and calculate the winnings
  bet.forEach((bet) => {
    // Initialize the prize value
    let prize = 0;

    // Get the winning number and color
    const number = winningNumberObj?.number as number;
    const color = winningNumberObj?.color;

    // Check the type of the bet, calculate the prize and add the result to the list
    switch (bet.type) {
      case "czarne":
        // Check if the winning number is black
        if (color === "black") {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "czerwone":
        // Check if the winning number is red
        if (color === "red") {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "nieparzyste":
        // Check if the winning number is odd
        if (number % 2 !== 0) {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "parzyste":
        // Check if the winning number is even
        if (number % 2 === 0 && number !== 0) {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "1 do 18":
        // Check if the winning number is between 1 and 18
        if (number >= 1 && number <= 18) {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "19 do 36":
        // Check if the winning number is between 19 and 36
        if (number >= 19 && number <= 36) {
          prize = bet.value * 2;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "1 do 12":
        // Check if the winning number is between 1 and 12
        if (number >= 1 && number <= 12) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "13 do 24":
        // Check if the winning number is between 13 and 24
        if (number >= 13 && number <= 24) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "25 do 36":
        // Check if the winning number is between 25 and 36
        if (number >= 25 && number <= 36) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "rząd 1":
        // Check if the winning number is in the first row
        if (number % 3 === 0) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "rząd 2":
        // Check if the winning number is in the second row
        if (number % 3 === 2) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      case "rząd 3":
        // Check if the winning number is in the third row
        if (number % 3 === 1) {
          prize = bet.value * 3;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
      default:
        // Check if the winning number matches the bet
        if (bet.type === number.toString()) {
          prize = bet.value * 36;
          result.push({
            type: bet.type,
            value: bet.value,
            moneyWon: prize,
          });
        }
        break;
    }

    // Add the prize to the player's balance if it's greater than 0
    if (prize > 0) {
      money.value += prize;
    }

    // Check if the player has run out of money and end the game
    // Display a message about losing and the possibility of recharging the account
    // The link redirects to a YouTube video about treating gambling addiction
    if (money.value == 0) {
      error.value =
        "Przegrałeś wszystkie pieniądze! <a href='https://tinyurl.com/DoladujRuletke' target='_blank'>Kliknij, aby zasilić konto</a>";
      return;
    }

    // Show the "Play Again" button
    playAgainButtonVisibility.value = true;
  });
};

/**
 * Function that resets the game state and allows the player to play again
 */
const playAgain = () => {
  // Clear the results of the last round
  result.length = 0;

  // Allow the player to place new bets
  isSpinning.value = false;

  // Reset the color of the number cells
  const numberCells = document.querySelectorAll(".numberCell");
  numberCells.forEach((cell) => {
    (cell as HTMLElement).style.backgroundColor = "#007b41";
  });

  // Clear the current bet and stake value and hide the "Play Again" button
  currentBet.value = "";
  stakeValue.value = 0;
  stakeInput.value!.value = "";
  playAgainButtonVisibility.value = false;
};

/**
 * Function that simulates the roulette spinning animation
 * and returns the winning number
 */
const spinRoulette = (): Promise<number> => {
  // Return a promise that resolves with the winning number
  return new Promise<number>((resolve) => {
    // Select all the number cells in the table
    const numberCells = document.querySelectorAll(".numberCell");

    // Calculate the duration of the spinning animation (between 8 and 18 seconds)
    const duration = Math.random() * 10000 + 8000;
    const endTime = Date.now() + duration;

    // Initialize the wait time and the current index
    let waitTime = 10;
    let currentIndex = 0;

    /**
     * Function that changes the color of the number cells
     * and resolves the promise with the winning number
     */
    const changeColor = () => {
      // Check if the spinning duration has elapsed
      if (Date.now() >= endTime) {
        (numberCells[currentIndex] as HTMLElement).style.backgroundColor =
          "yellow";

        // Check if the current index is greater than 0 and change the color of the previous cell
        // Otherwise, change the color of the last cell
        if (currentIndex > 0) {
          (numberCells[currentIndex - 1] as HTMLElement).style.backgroundColor =
            "#007b41";
        } else {
          (
            numberCells[numberCells.length - 1] as HTMLElement
          ).style.backgroundColor = "#007b41";
        }

        // Get the winning number from the current cell and resolve the promise
        const winningNumber = parseInt(
          numberCells[currentIndex].getAttribute("value") as string
        );

        // Resolve the promise with the winning number
        resolve(winningNumber);
        return;
      }

      // Change the color of the last iterated cell back to the default color
      if (currentIndex > 0) {
        (numberCells[currentIndex - 1] as HTMLElement).style.backgroundColor =
          "#007b41";
      } else {
        (
          numberCells[numberCells.length - 1] as HTMLElement
        ).style.backgroundColor = "#007b41";
      }

      // Change the color of the current cell to yellow
      (numberCells[currentIndex] as HTMLElement).style.backgroundColor =
        "yellow";

      // Update the current index
      currentIndex = (currentIndex + 1) % numberCells.length;

      // Increase the wait time and call the function recursively
      setTimeout(changeColor, waitTime);
      waitTime *= 1.0315;
    };

    // Start the spinning animation
    changeColor();
  });
};

// List of numbers on the roulette wheel with their corresponding colors
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
  margin-top: 1rem;
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
  margin-bottom: 0.75rem;
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
.currentBet {
  font-weight: bold;
}

.small-window {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  color: white;
  font-size: 24px;
}
.big-alert {
  font-size: 22px;
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}
.small-alert {
  font-size: 18px;
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  display: inline-block;
  font-weight: bold;
}
.rotate-icon {
  text-align: center;
}
.rotated-phone {
  transform: rotate(90deg) !important;
}
.arrow{
  transform: rotate(90deg) !important;
  margin-left: .9rem;
  margin-right: 1.4rem;
}
</style>
<style>
.error a {
  color: white;
  cursor: pointer;
  text-decoration: none;
}
</style>
