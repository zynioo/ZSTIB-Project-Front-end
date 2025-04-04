<template>
  <div class="nbp-container">
    <h1>Kursy Walut NBP</h1>
    <div class="container">
      <!-- Currency Converter Section -->
      <div class="converter-section">
        <h2>Przelicznik walut</h2>
        <div class="converter-container">
          <div class="converter-row">
            <div class="converter-group">
              <label for="amount">Kwota</label>
              <input
                type="number"
                id="amount"
                placeholder="Wpisz kwotę"
                step="0.01"
                min="0"
                v-model="amount"
                value="100"
              />
            </div>

            <div class="converter-group">
              <label for="fromCurrency">Z waluty</label>
              <select id="fromCurrency" v-model="fromCurrency">
                <option value="PLN">PLN - Polski złoty</option>
                <option
                  v-for="rate in allRates"
                  :key="'from-' + rate.code"
                  :value="rate.code"
                >
                  {{ rate.code }} - {{ formatCurrency(rate.currency) }}
                </option>
              </select>
            </div>

            <div class="swap-icon" @click="swapCurrencies" id="swap-currencies">
              <i class="fas fa-exchange-alt"></i>
            </div>

            <div class="converter-group">
              <label for="toCurrency">Na walutę</label>
              <select id="toCurrency" v-model="toCurrency">
                <option value="PLN">PLN - Polski złoty</option>
                <option
                  v-for="rate in allRates"
                  :key="'to-' + rate.code"
                  :value="rate.code"
                >
                  {{ rate.code }} - {{ formatCurrency(rate.currency) }}
                </option>
              </select>
            </div>

            <button
              class="convert-button"
              @click="convertCurrency"
              id="convert-button"
            >
              Przelicz
            </button>
          </div>

          <div class="result" v-show="showResult" id="result-container">
            <div class="result-card">
              <div class="result-amount" id="result-amount">
                {{ formattedResultAmount }}
              </div>
              <div class="result-equals">
                <i class="fas fa-equals"></i>
              </div>
              <div class="result-converted" id="result-converted">
                {{ formattedResultConverted }}
              </div>
              <div class="result-rate" id="result-rate">{{ resultRate }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loader" id="loader">
        <i class="fas fa-spinner fa-spin"></i> Ładowanie danych...
      </div>

      <div id="result" v-else>
        <div class="table-controls">
          <div class="sort-options">
            <button
              v-for="(label, method) in sortMethods"
              :key="method"
              class="sort-btn"
              :class="{ active: currentSort === method }"
              :data-sort="method"
              @click="changeSort(method)"
            >
              <i :class="sortIcons[method]"></i> {{ label }}
            </button>
          </div>
          <div class="page-info">
            Pokazuję
            <span id="page-range">{{ startRange }}-{{ endRange }}</span> z
            <span id="total-count">{{ totalCount }}</span> walut
          </div>
        </div>

        <table id="rates-table">
          <thead>
            <tr>
              <th>Waluta</th>
              <th>Kod</th>
              <th class="exchange">Kurs</th>
            </tr>
          </thead>
          <tbody id="rates-body">
            <tr
              v-for="rate in paginatedRates"
              :key="rate.code"
              :data-currency="rate.code"
              :class="{
                'from-selected': rate.code === fromCurrency,
                selected: rate.code === toCurrency,
              }"
              @click="setCurrencyFromTableRow(rate.code)"
            >
              <td class="currency-name">
                <img
                  class="currency-flag"
                  :src="`https://flagcdn.com/32x24/${getCurrencyCountryCode(rate.code)}.png`"
                  :alt="`${rate.code} flag`"
                  @error="handleFlagError"
                />
                <span>{{ formatCurrency(rate.currency) }}</span>
              </td>
              <td class="currency-code">{{ rate.code }}</td>
              <td class="rate-value">{{ formatRate(rate.mid) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination" id="pagination-container">
          <button @click="prevPage" :disabled="currentPage === 1">
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="pageNum in visiblePageNumbers"
            :key="pageNum"
            :class="{ active: currentPage === pageNum }"
            class="pages-btn"
            @click="goToPage(pageNum)"
          >
            {{ pageNum }}
          </button>

          <button @click="nextPage" :disabled="currentPage === totalPages">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="date-info">
          <i class="far fa-calendar-alt"></i>
          <span id="date-info">{{ dateInfo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";

type CurrencyRate = {
  code: string;
  currency: string;
  mid: number;
};

type SortMethods = "default" | "strongest" | "weakest" | "alphabetical";

const allRates = ref<CurrencyRate[]>([]);
const displayRates = ref<CurrencyRate[]>([]);
const loading = ref<boolean>(true);
const dateInfo = ref<string>("Ładowanie danych...");
const amount = ref<number>(100);
const fromCurrency = ref<string>("EUR");
const toCurrency = ref<string>("PLN");
const resultConverted = ref<number>(0);
const showResult = ref<boolean>(false);
const tableInfos = ref<string[]>([]);

// Pagination state
const itemsPerPage = 20;
const currentPage = ref<number>(1);

// Sorting state
const currentSort = ref<SortMethods>("default");
const sortMethods = {
  default: "Domyślnie",
  strongest: "Najsilniejsze",
  weakest: "Najsłabsze",
  alphabetical: "Alfabetycznie",
};
const sortIcons = {
  default: "fas fa-sort",
  strongest: "fas fa-sort-amount-up-alt",
  weakest: "fas fa-sort-amount-down",
  alphabetical: "fas fa-sort-alpha-down",
};

const currencyToCountry: Record<string, string> = {
  USD: "us", EUR: "eu", CHF: "ch", GBP: "gb", JPY: "jp", AUD: "au", 
  CAD: "ca", HKD: "hk", NZD: "nz", SEK: "se", DKK: "dk", NOK: "no", 
  CZK: "cz", HUF: "hu", RON: "ro", BGN: "bg", TRY: "tr", ILS: "il", 
  CLP: "cl", PHP: "ph", MXN: "mx", ZAR: "za", BRL: "br", MYR: "my", 
  RUB: "ru", IDR: "id", INR: "in", KRW: "kr", CNY: "cn", XDR: "un", 
  THB: "th", SGD: "sg", UAH: "ua", AED: "ae", AFN: "af", ALL: "al", 
  AMD: "am", ARS: "ar", AZN: "az", BAM: "ba", BDT: "bd", BHD: "bh", 
  BYN: "by", BOB: "bo", COP: "co", CRC: "cr", DZD: "dz", EGP: "eg", 
  GEL: "ge", GHS: "gh", HNL: "hn", HRK: "hr", ISK: "is", JOD: "jo", 
  KES: "ke", KGS: "kg", KHR: "kh", KWD: "kw", KZT: "kz", LBP: "lb", 
  LKR: "lk", MAD: "ma", MDL: "md", MKD: "mk", MMK: "mm", MNT: "mn", 
  MUR: "mu", MZN: "mz", NGN: "ng", NPR: "np", OMR: "om", PAB: "pa", 
  PEN: "pe", PKR: "pk", PLN: "pl", PYG: "py", QAR: "qa", RSD: "rs", 
  SAR: "sa", SZL: "sz", TND: "tn", TTD: "tt", TWD: "tw", TZS: "tz", 
  UYU: "uy", UZS: "uz", VES: "ve", VND: "vn", XAF: "cf", XOF: "ci", 
  XPF: "pf"
};

// Computed properties
const sortedRates = computed(() => {
  return sortCurrencies([...displayRates.value], currentSort.value);
});

const totalPages = computed(() => {
  return Math.ceil(sortedRates.value.length / itemsPerPage);
});

const paginatedRates = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return sortedRates.value.slice(startIndex, endIndex);
});

const visiblePageNumbers = computed(() => {
  let startPage = Math.max(1, currentPage.value - 2);
  let endPage = Math.min(totalPages.value, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pageNumbers:number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
});

const startRange = computed(() => {
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endRange = computed(() => {
  return Math.min(startRange.value + itemsPerPage - 1, totalCount.value);
});

const totalCount = computed(() => {
  return displayRates.value.length;
});

const formattedResultAmount = computed(() => {
  return `${formatAmount(amount.value)} ${fromCurrency.value}`;
});

const formattedResultConverted = computed(() => {
  return `${formatAmount(resultConverted.value)} ${toCurrency.value}`;
});

const resultRate = computed(() => {
  const fromRate = getRateForCurrency(fromCurrency.value);
  const toRate = getRateForCurrency(toCurrency.value);
  if (!fromRate || !toRate) return "";

  const conversionRate = fromRate / toRate;
  return `1 ${fromCurrency.value} = ${formatAmount(conversionRate)} ${toCurrency.value}`;
});

// Methods
const getCurrencyCountryCode = (code: string): string => {
  return currencyToCountry[code] || (code ? code.slice(0, 2).toLowerCase() : "unknown");
};

const formatCurrency = (currency: string): string => {
  return currency.charAt(0).toUpperCase() + currency.slice(1).toLowerCase();
};

const formatRate = (rate: number): string => {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(rate);
};

const formatAmount = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const handleFlagError = (event: Event): void => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";

  // Create icon element to replace the flag
  const parentElement = img.parentElement;
  if (parentElement) {
    // Check if an icon already exists
    const existingIcon = parentElement.querySelector(".fas.fa-coins");
    if (!existingIcon) {
      const icon = document.createElement("i");
      icon.className = "fas fa-coins";
      icon.style.marginRight = "10px";
      icon.style.color = "#00529e";
      parentElement.prepend(icon);
    }
  }
};

const getRateForCurrency = (currencyCode: string): number => {
  // PLN is the base currency with rate 1
  if (currencyCode === "PLN") return 1;

  const currency = allRates.value.find((rate) => rate.code === currencyCode);
  return currency ? currency.mid : 0;
};

const convertCurrency = (): void => {
  const amountValue = parseFloat(amount.value.toString());
  if (!amountValue || isNaN(amountValue)) return;

  const fromRate = getRateForCurrency(fromCurrency.value);
  const toRate = getRateForCurrency(toCurrency.value);

  if (fromRate && toRate) {
    // Convert to PLN first, then to target currency
    const inPLN = amountValue * fromRate;
    resultConverted.value = toRate === 1 ? inPLN : inPLN / toRate;

    // Show result container
    showResult.value = true;
  }
};

const swapCurrencies = (): void => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  convertCurrency();
};

const setCurrencyFromTableRow = (currencyCode: string): void => {
  toCurrency.value = currencyCode;
  convertCurrency();
};

const sortCurrencies = (rates: CurrencyRate[], sortMethod: SortMethods): CurrencyRate[] => {
  switch (sortMethod) {
    case "strongest":
      // Sort by exchange rate - strongest first (highest rate)
      return [...rates].sort((a, b) => b.mid - a.mid);
    case "weakest":
      // Sort by exchange rate - weakest first (lowest rate)
      return [...rates].sort((a, b) => a.mid - b.mid);
    case "alphabetical":
      // Sort alphabetically by code
      return [...rates].sort((a, b) => a.code.localeCompare(b.code));
    default:
      // Default sorting (as returned from API)
      return [...rates];
  }
};

const changeSort = (sortMethod: SortMethods): void => {
  currentSort.value = sortMethod;
  currentPage.value = 1; // Reset to first page when sorting changes
};

const prevPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (pageNum: number): void => {
  currentPage.value = pageNum;
};

// Remove duplicates from combined tables
const removeDuplicates = (rates: CurrencyRate[]): CurrencyRate[] => {
  const uniqueRates: CurrencyRate[] = [];
  const seenCodes = new Set<string>();

  rates.forEach((rate) => {
    if (!seenCodes.has(rate.code)) {
      seenCodes.add(rate.code);
      uniqueRates.push(rate);
    }
  });

  return uniqueRates;
};

// Fetch data on mount
onMounted(async () => {
  try {
    const response = await fetch("https://api.nbp.pl/api/exchangerates/tables/A/?format=json");
    const data = await response.json();

    const table = data[0]; // First table in the response
    const rates = removeDuplicates(table.rates);

    allRates.value = rates;
    displayRates.value = rates;

    // Set date information from API response
    dateInfo.value = `Dane z dnia ${table.effectiveDate}`;
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
:root {
  --primary: #007b41;
  --secondary: #1e1e1e;
  --accent: #ffc107;
  --text: #ffffff;
  --border: #2e2e2e;
  --dark: #005f2f;
  --hover: #005f2f;
  --background: #121212;
}

.nbp-container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: var(--background);
  color: var(--text);
  min-height: 100vh;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
  font-size: 2.2rem;
}

h1:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 3px;
  background-color: var(--accent);
  border-radius: 3px;
}

.container {
  background-color: var(--secondary);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.controls {
  margin-bottom: 25px;
  display: flex;
  gap: 15px;
  align-items: center;
  background-color: var(--background);
  padding: 12px 15px;
  border-radius: 8px;
}

select {
  padding: 12px 18px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--primary);
  color: white;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  flex-grow: 1;
  max-width: 200px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  padding-right: 35px;
  box-shadow: 0 0 5px 0 rgba(255, 255, 255, 0.05);
}
select:hover {
  background-color: #006b39;
}

select:focus {
  border-color: #3e3e3e;
  background-color: #006535;
  box-shadow: 0 0 8px 0 rgba(255, 255, 255, 0.08);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 14px 18px;
  text-align: left;
}

th {
  background-color: var(--primary);
  color: white;
  font-weight: 500;
  position: sticky;
  top: 0;
}

th:first-child {
  border-top-left-radius: 8px;
}

th:last-child {
  border-top-right-radius: 8px;
}

tr:nth-child(even) {
  background-color: #181818;
}

tr:nth-child(odd) {
  background-color: var(--background);
}

tr {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--border);
}

tr:hover {
  background-color: rgba(0, 123, 65, 0.2);
}

.loader {
  text-align: center;
  padding: 30px;
  color: var(--primary);
  font-size: 20px;
}

.loader i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.currency-flag {
  width: 28px;
  height: 21px;
  margin-right: 12px;
  vertical-align: middle;
  border-radius: 3px;
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.rate-value {
  font-weight: 600;
  text-align: right;
  color: white;
}

.date-info {
  color: #aaa;
  font-size: 15px;
  text-align: center;
  margin-top: 25px;
  background-color: var(--background);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.currency-name {
  display: flex;
  color: white;
  align-items: center;
}

.currency-code {
  font-weight: 600;
  color: white;
}
.exchange {
  text-align: right;
}
/* Currency Converter Styles */
.converter-section {
  margin: 30px 0;
  background-color: var(--background);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.converter-section h2 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.converter-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.converter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 15px;
  justify-content: center;
}

.converter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 120px;
}

.converter-group label {
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.converter-group input,
.converter-group select {
  padding: 12px 18px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background-color: var(--primary);
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.converter-group input:hover,
.converter-group select:hover {
  background-color: #006b39;
}

.converter-group input:focus,
.converter-group select:focus {
  background-color: #006535;
  border-color: #3e3e3e;
  box-shadow: 0 0 8px 0 rgba(255, 255, 255, 0.08);
}

.converter-group input[type="number"]::-webkit-inner-spin-button,
.converter-group input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.swap-icon {
  display: flex;
  align-items: flex-end;
  padding-bottom: 12px;
  color: white;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s ease;
}

.swap-icon:hover {
  transform: rotate(180deg);
}

.convert-button {
  padding: 12px 24px;
  background-color: var(--primary);
  color: white;
  border: 1px solid #000;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 0;
  height: 49px;
  box-shadow: 0 0 7px 0 rgba(255, 255, 255, 0.123);
  position: relative;
  overflow: hidden;
}

.convert-button:hover {
  background-color: var(--dark);
  box-shadow: 0 0 12px 0 rgba(255, 255, 255, 0.123);
}

.convert-button:active {
  transform: scale(0.95);
  box-shadow: 0 0 15px 0 rgba(255, 255, 255, 0.3);
}

.convert-button:active::before {
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

.result {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  padding: 10px;
}

.result-card {
  background: var(--secondary);
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  position: relative;
}

.result-amount {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.result-equals {
  color: var(--accent);
  font-size: 20px;
}

.result-converted {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
}

.result-rate {
  font-size: 14px;
  color: var(--primary);
  position: absolute;
  bottom: 5px;
  right: 15px;
}

@media (max-width: 768px) {
  .converter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .swap-icon {
    align-self: center;
    transform: rotate(90deg);
    padding: 10px 0;
  }

  .swap-icon:hover {
    transform: rotate(270deg);
  }

  .result-card {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .result-rate {
    position: static;
    text-align: center;
    margin-top: 10px;
    width: 100%;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 20px 15px;
  }

  th,
  td {
    padding: 12px 10px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .currency-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .currency-flag {
    margin-bottom: 5px;
  }

  .converter-section h2 {
    font-size: 1.3rem;
  }

  .converter-group {
    min-width: 100%;
  }

  .convert-button {
    width: 100%;
  }
}

/* Highlight selected row */
tr.selected {
  background-color: rgba(0, 217, 116, 0.3) !important;
}

/* Gold highlight for from currency */
tr.from-selected {
  background-color: rgba(112, 226, 255, 0.584) !important;
  border-left: 3px solid var(--accent);
}

/* Add visual feedback on table row hover */

/* Pagination styles */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
}

.pagination button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination button:hover {
  background-color: #007b41;
}

.pagination button.active {
  background-color: #007b41;
  color: #000;
  font-weight: bold;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Sorting controls */
.table-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.sort-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sort-btn {
  background-color: var(--background);
  color: white;
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sort-btn:hover,
.sort-btn.active {
  background-color: var(--primary);
}

.sort-btn.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.page-info {
  color: #aaa;
  font-size: 14px;
  margin-left: auto;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 500px;
    height: 500px;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-info {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
