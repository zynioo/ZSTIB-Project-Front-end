<template>
  <div class="search-container">
    <div class="search-box">
      <div class="search-input">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Wyszukaj danie, kategorię lub składnik..."
          @keyup.enter="searchMeals"
        />
        <select v-model="searchType">
          <option value="name">Nazwa Dania</option>
          <option value="category">Kategoria</option>
          <option value="area">Kuchnia</option>
          <option value="ingredient">Składnik</option>
        </select>
        <button @click="searchMeals" class="search-button">Szukaj</button>
      </div>
    </div>

    <div v-if="searchType === 'category'" class="categories-container">
      <h3>Popularne Kategorie</h3>
      <div class="categories">
        <div
          v-for="category in categories"
          :key="category.strCategory"
          class="category-item"
          @click="selectCategory(category.strCategory)"
        >
          <img :src="category.strCategoryThumb" :alt="category.strCategory" />
          <span>{{ category.strCategory }}</span>
        </div>
      </div>
    </div>

    <div v-if="searchType === 'area'" class="areas-container">
      <h3>Popularne Kuchnie</h3>
      <div class="areas">
        <div
          v-for="area in areas"
          :key="area.strArea"
          class="area-item"
          @click="selectArea(area.strArea)"
        >
          <div class="area-icon">
            <img
              :src="getCountryFlag(area.strArea)"
              :alt="area.strArea"
              class="flag-icon"
            />
          </div>
          <span>{{ area.strArea }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Wyszukiwanie pysznych dań...</p>
    </div>

    <div v-else-if="meals && meals.length > 0" class="meals-grid">
      <MealView
        v-for="meal in meals"
        :key="meal.idMeal"
        :meal="meal"
        @view-details="viewMealDetails"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <div v-else-if="hasSearched" class="no-results">
      <p>Nie znaleziono dań. Spróbuj innego wyszukiwania.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import MealView from "./MealView.vue";

const searchQuery = ref("");
const searchType = ref("name");
const meals = ref([]);
const loading = ref(false);
const hasSearched = ref(false);
const categories = ref([]);
const areas = ref([]);

const emit = defineEmits(["view-meal"]);

const handleFavoritesChange = () => {
  if (meals.value && meals.value.length > 0) {
    meals.value = [...meals.value];
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchAreas();
  window.addEventListener("favoritesUpdated", handleFavoritesChange);
});

onUnmounted(() => {
  window.removeEventListener("favoritesUpdated", handleFavoritesChange);
});

const fetchCategories = async () => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await response.json();
    categories.value = data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchAreas = async () => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const data = await response.json();
    areas.value = data.meals;
  } catch (error) {
    console.error("Error fetching areas:", error);
  }
};

const searchMeals = async () => {
  if (!searchQuery.value) return;

  loading.value = true;
  hasSearched.value = true;

  try {
    let url = "";

    if (searchType.value === "name") {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery.value}`;
    } else if (searchType.value === "category") {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchQuery.value}`;
    } else if (searchType.value === "ingredient") {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchQuery.value}`;
    } else if (searchType.value === "area") {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchQuery.value}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.meals) {
      if (searchType.value === "name") {
        meals.value = data.meals;
      }
      else {
        const mealsWithInfo = data.meals.map((meal) => {
          if (searchType.value === "category") {
            meal.strCategory = searchQuery.value;
          } else if (searchType.value === "area") {
            meal.strArea = searchQuery.value;
          }
          return meal;
        });
        meals.value = mealsWithInfo;
      }
    } else {
      meals.value = [];
    }
  } catch (error) {
    console.error("Error searching meals:", error);
    meals.value = [];
  } finally {
    loading.value = false;
  }
};

const selectCategory = async (category: string) => {
  searchQuery.value = category;
  searchType.value = "category";
  await searchMeals();
};

const selectArea = async (area: string) => {
  searchQuery.value = area;
  searchType.value = "area";
  await searchMeals();
};

const viewMealDetails = async (mealId: string) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      emit("view-meal", data.meals[0]);
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
};

const toggleFavorite = (meal: any) => {
  try {
  } catch (error) {
    console.error("Error handling toggle favorite:", error);
  }
};

const cuisineToCountryCode = {
  American: "us",
  British: "gb",
  Canadian: "ca",
  Chinese: "cn",
  Croatian: "hr",
  Dutch: "nl",
  Egyptian: "eg",
  Filipino: "ph",
  French: "fr",
  Greek: "gr",
  Indian: "in",
  Irish: "ie",
  Italian: "it",
  Jamaican: "jm",
  Japanese: "jp",
  Kenyan: "ke",
  Malaysian: "my",
  Mexican: "mx",
  Moroccan: "ma",
  Polish: "pl",
  Portuguese: "pt",
  Russian: "ru",
  Spanish: "es",
  Thai: "th",
  Tunisian: "tn",
  Turkish: "tr",
  Vietnamese: "vn",
  Unknown: "un", 
};

const getCountryFlag = (cuisine) => {
  const countryCode = cuisineToCountryCode[cuisine] || "un";
  return `https://flagcdn.com/${countryCode}.svg`;
};
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.search-box {
  background-color: var(--lightDark);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 40px;
  height: 40px;
  background-color: var(--primary);
  border-radius: 50%;
  opacity: 0.3;
  z-index: 0;
}

.search-input {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.search-input input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid var(--deepGray);
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--deepDark);
  color: var(--white);
  transition: all 0.3s;
  box-shadow: 0 0 0 transparent;
}

.search-input input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(134, 190, 66, 0.3);
}

.search-input input::placeholder {
  color: var(--gray);
}

.search-input select {
  padding: 0 20px;
  border: 2px solid var(--deepGray);
  border-radius: 8px;
  background-color: var(--deepDark);
  color: var(--white);
  cursor: pointer;
  transition: all 0.3s;
}

.search-input select:focus {
  outline: none;
  border-color: var(--primary);
}

.search-button {
  background: linear-gradient(135deg, var(--primary), var(--primaryHover));
  color: var(--white);
  border: none;
  padding: 0 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.search-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s;
}

.search-button:hover::before {
  left: 100%;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(134, 190, 66, 0.4);
}

.search-button:active {
  transform: translateY(1px);
}

/* Kategorie i obszary */
.categories-container,
.areas-container {
  margin-top: 20px;
  background-color: var(--lightDark);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.6s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.categories-container h3,
.areas-container h3 {
  margin-bottom: 15px;
  color: var(--white);
  font-size: 18px;
  position: relative;
  padding-left: 15px;
}

.categories-container h3::before,
.areas-container h3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 20px;
  background-color: var(--primary);
  border-radius: 5px;
}

.categories,
.areas {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--deepGray);
}

.categories::-webkit-scrollbar,
.areas::-webkit-scrollbar {
  height: 6px;
}

.categories::-webkit-scrollbar-track,
.areas::-webkit-scrollbar-track {
  background: var(--deepGray);
  border-radius: 10px;
}

.categories::-webkit-scrollbar-thumb,
.areas::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}

/* Kategorie */
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
  padding: 10px;
  background-color: var(--deepGray);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.category-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  background-color: var(--deepDark);
}

.category-item img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid var(--primary);
  transition: all 0.3s;
  box-shadow: 0 0 15px rgba(134, 190, 66, 0.5);
}

.category-item:hover img {
  transform: scale(1.1);
}

.category-item span {
  font-size: 14px;
  color: var(--white);
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
}

/* Obszary/Kuchnie */
.area-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
  padding: 15px;
  background-color: var(--deepGray);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.area-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary);
  transform: scaleX(0);
  transition: transform 0.3s;
  transform-origin: right;
}

.area-item:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.area-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  background-color: var(--deepDark);
}

.area-icon {
  width: 70px;
  height: 70px;
  background-color: var(--deepDark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 3px solid var(--primary);
  transition: all 0.3s;
}

.area-item:hover .area-icon {
  transform: rotate(10deg);
}

.flag-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
}

.area-item:hover .flag-icon {
  transform: scale(1.2);
}

.area-item span {
  font-size: 14px;
  color: var(--white);
  text-align: center;
  font-weight: 600;
  margin-top: 5px;
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 30px;
  animation: fadeInUp 0.5s ease-out;
}

.meals-grid > * {
  width: 100%;
  box-sizing: border-box;
}

.loading,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  color: var(--lightGray);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--deepGray);
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results p {
  font-size: 18px;
  color: var(--lightGray);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Responsywne style */
@media screen and (max-width: 1200px) {
  .meals-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
  }
}

@media screen and (max-width: 992px) {
  .meals-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .search-input {
    flex-wrap: wrap;
  }

  .search-input input {
    min-width: 200px;
  }
}

@media screen and (max-width: 768px) {
  .search-input {
    flex-direction: column;
    gap: 15px;
  }

  .search-input input,
  .search-input select,
  .search-button {
    width: 100%;
  }

  .categories-container,
  .areas-container {
    padding: 15px;
  }

  .categories,
  .areas {
    padding-bottom: 15px; /* Dodatkowy padding na dole dla wygodniejszego przewijania */
  }

  .category-item,
  .area-item {
    min-width: 110px;
  }

  .meals-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}

@media screen and (max-width: 576px) {
  .meals-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .search-box {
    padding: 15px;
  }

  .area-icon,
  .category-item img {
    width: 60px;
    height: 60px;
  }

  .search-input input {
    padding: 12px 15px;
  }
}

@media (max-width: 768px) {
  .search-input {
    flex-direction: column;
  }

  .categories-container,
  .areas-container {
    padding: 15px;
  }

  .category-item,
  .area-item {
    min-width: 100px;
  }

  .category-item img,
  .area-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
