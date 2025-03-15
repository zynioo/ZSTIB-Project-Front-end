<template>
  <div class="roulette-table-container">
    <table class="roulette-table">
      <tbody>
        <tr v-for="(row, rowIndex) in formattedTable" :key="rowIndex">
          <template v-if="rowIndex === 0">
            <td
              :rowspan="3"
              class="cell zero option numberCell"
              value="0"
              @click="chosen"
              v-on:click="chooseOption('0')"
            >
              0
            </td>
          </template>

          <td
            v-for="cell in row"
            :key="cell.number"
            class="cell option numberCell"
            :value="cell.number"
            @click="chosen"
            v-on:click="chooseOption(cell.number.toString())"
          >
            <div class="number" :style="{ backgroundColor: cell.color }">
              {{ cell.number }}
            </div>
          </td>
          <td
            class="twoToOneCell option"
            @click="chosen"
            v-on:click="chooseOption('rząd ' + (rowIndex + 1))"
          >
            <div class="inCellTextBorder">2 do 1</div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td
            class="bigCell option"
            colspan="4"
            @click="chosen"
            v-on:click="chooseOption('1 - 12')"
          >
            <div class="inCellTextBorder">1 - 12</div>
          </td>
          <td
            class="bigCell option"
            colspan="4"
            @click="chosen"
            v-on:click="chooseOption('13 - 24')"
          >
            <div class="inCellTextBorder">13 - 24</div>
          </td>
          <td
            class="bigCell option"
            colspan="4"
            @click="chosen"
            v-on:click="chooseOption('25 - 36')"
          >
            <div class="inCellTextBorder">25 - 36</div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td
            class="bigCell option"
            colspan="2"
            @click="chosen"
            v-on:click="chooseOption('1 - 18')"
          >
            <div class="inCellTextBorder">1 - 18</div>
          </td>
          <td
            class="bigCell option"
            colspan="2"
            @click="chosen"
            v-on:click="chooseOption('parzyste')"
          >
            <div class="inCellTextBorder even">Parzyste</div>
          </td>
          <td
            class="bigCell option"
            colspan="2"
            @click="chosen"
            v-on:click="chooseOption('czerwone')"
          >
            <div class="inCellTextBorder redCell">&nbsp;</div>
          </td>
          <td
            class="bigCell option"
            colspan="2"
            @click="chosen"
            v-on:click="chooseOption('czarne')"
          >
            <div class="inCellTextBorder blackCell">&nbsp;</div>
          </td>
          <td
            class="bigCell option"
            colspan="2"
            @click="chosen"
            v-on:click="chooseOption('nieparzyste')"
          >
            <div class="inCellTextBorder odd">Nieparzyste</div>
          </td>
          <td
            class="bigCell option"
            colspan="2"
            v-on:click="chooseOption('19 - 36')"
            @click="chosen"
          >
            <div class="inCellTextBorder">19 - 36</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted } from "vue";

const options = ref<NodeListOf<HTMLElement> | null>(null);

onMounted(() => {
  options.value = document.querySelectorAll(".option");
});

const chosen = (event: Event) => {
  let target = event.target as HTMLElement;
  if (target.tagName.toLowerCase() === "div") {
    target = target.parentElement as HTMLElement;
  }
  if (options.value) {
    options.value.forEach((option) => {
      option.classList.remove("chosen");
    });
  }
  target.classList.add("chosen");
};

const props = defineProps<{
  chooseOption: (option: string) => void;
  numbers: { number: number; color: string }[];
}>();

const formattedTable = computed(() => {
  let rows: any[] = [[], [], []];

  // Distribute numbers among the three rows
  props.numbers.forEach((item, index) => {
    if (index != 0) {
      rows[(index - 1) % 3].push(item);
    }
  });

  return rows;
});
</script>

<style scoped>
.roulette-table-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  background-color: #007b41;
  border-radius: 25px;
  box-shadow: 0 0 25px 0 rgba(255, 255, 255, 0.123);
}
.roulette-table {
  border-collapse: collapse;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.cell {
  width: 60px;
  height: 60px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  border: 2px solid #fff;
  color: white;
  font-size: 22px;
  rotate: -90deg;
  cursor: pointer;
}
.bigCell {
  height: 60px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  border: 2px solid #fff;
  color: white;
  font-size: 22px;
  cursor: pointer;
}

.zero {
  color: white;
  font-weight: bold;
  rotate: 0deg;
}
.number {
  display: inline-block;
  width: 95%;
  height: 60%;
  border-radius: 50%;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: white;
  vertical-align: middle;
}

.twoToOneCell {
  width: 60px;
  height: 60px;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  border: 2px solid #fff;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
.twoToOneCell div {
  rotate: -90deg;
  display: block;
  padding: 0;
  width: auto;
}
.inCellTextBorder {
  border: 2px solid white;
  border-radius: 10px;
  display: inline-block;
  width: 100px;
  line-height: 33px;
}
.redCell {
  background-color: red;
}
.blackCell {
  background-color: black;
}
.odd,
.even {
  font-size: 16px;
}
.chosen {
  background-color: #005f2f;
}
.option,
.inCellTextBorder {
  user-select: none;
}
</style>
