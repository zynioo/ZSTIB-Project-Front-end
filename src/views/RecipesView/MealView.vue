<template>
  <div class="meal-card" @click="viewRecipe">
    <img :src="meal.strMealThumb" :alt="meal.strMeal" class="meal-image" />
    <div class="meal-info">
      <div class="recipe-title-row">
        <h3>{{ meal.strMeal }}</h3>
        <button
          class="favorite-btn"
          @click.stop="toggleFavorite"
          :class="{ active: isFavorite }"
        >
          <i class="fa-heart" :class="isFavorite ? 'fas' : 'far'"></i>
        </button>
      </div>
      <p class="meal-category">
        Kategoria: {{ meal.strCategory || "Nieznana" }}
      </p>
      <p class="meal-area">
        Kuchnia: {{ meal.strArea || "Nieznana" }}
        <img
          v-if="meal.strArea && getCountryCode(meal.strArea)"
          :src="getCountryFlag(meal.strArea)"
          :alt="meal.strArea"
          class="small-flag"
        />
      </p>
      <button class="view-recipe-btn" @click="viewRecipe">
        Zobacz Przepis
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  meal: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["view-details", "toggle-favorite"]);

// Lokalne ref zamiast computed
const isFavorite = ref(false);

// Funkcja do sprawdzania czy przepis jest w ulubionych
const checkFavoriteStatus = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem("favoriteMeals") || "[]");
    isFavorite.value = favorites.some(
      (fav) => fav.idMeal === props.meal.idMeal
    );
  } catch (error) {
    console.error("Error checking favorite status:", error);
    isFavorite.value = false;
  }
};

// Funkcja do obsługi zdarzenia zmiany ulubionych
const handleFavoritesChange = () => {
  checkFavoriteStatus();
};

// Sprawdzamy status przy montowaniu i ustawiamy nasłuchiwanie na zdarzenie
onMounted(() => {
  checkFavoriteStatus();
  window.addEventListener("storage", handleFavoritesChange);
  window.addEventListener("favoritesUpdated", handleFavoritesChange);
});

// Czyścimy nasłuchiwanie przy odmontowaniu
onUnmounted(() => {
  window.removeEventListener("storage", handleFavoritesChange);
  window.removeEventListener("favoritesUpdated", handleFavoritesChange);
});

// Obserwujemy zmiany we właściwości meal
watch(
  () => props.meal?.idMeal,
  async () => {
    checkFavoriteStatus();

    // Sprawdź czy brakuje danych o kategorii lub kuchni
    if (
      props.meal &&
      props.meal.idMeal &&
      (!props.meal.strCategory || !props.meal.strArea)
    ) {
      try {
        // Pobierz pełne dane o posiłku, jeśli brakuje informacji
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${props.meal.idMeal}`
        );
        const data = await response.json();

        if (data.meals && data.meals[0]) {
          // Uzupełnij brakujące dane
          if (!props.meal.strCategory)
            props.meal.strCategory = data.meals[0].strCategory;
          if (!props.meal.strArea) props.meal.strArea = data.meals[0].strArea;
        }
      } catch (error) {
        console.error("Error fetching complete meal details:", error);
      }
    }
  }
);

const viewRecipe = () => {
  emit("view-details", props.meal.idMeal);
};

const toggleFavorite = (event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    // Pobieramy aktualne ulubione z localStorage
    const favorites = JSON.parse(localStorage.getItem("favoriteMeals") || "[]");
    const existingIndex = favorites.findIndex(
      (fav) => fav.idMeal === props.meal.idMeal
    );

    // Aktualizujemy ulubione
    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      isFavorite.value = false;
    } else {
      // Zapisujemy tylko podstawowe informacje
      const mealToSave = {
        idMeal: props.meal.idMeal,
        strMeal: props.meal.strMeal,
        strMealThumb: props.meal.strMealThumb,
        strCategory: props.meal.strCategory || "",
        strArea: props.meal.strArea || "",
      };
      favorites.push(mealToSave);
      isFavorite.value = true;
    }

    // Zapisujemy do localStorage
    localStorage.setItem("favoriteMeals", JSON.stringify(favorites));

    // Emitujemy proste zdarzenie
    window.dispatchEvent(new Event("favoritesUpdated"));

    // Informujemy rodzica o zmianie
    emit("toggle-favorite", props.meal);
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

// Mapa mapująca nazwy kuchni z TheMealDB na kody krajów ISO
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
};

// Funkcja do pobierania kodu kraju dla danej kuchni
const getCountryCode = (cuisine) => {
  return cuisineToCountryCode[cuisine];
};

// Funkcja do pobierania flagi dla danej kuchni
const getCountryFlag = (cuisine) => {
  const countryCode = cuisineToCountryCode[cuisine] || "un";
  return `https://flagcdn.com/${countryCode}.svg`;
};
</script>

<style scoped>
:root {
  --primary: #86be42;
  --primaryHover: #6f9e3f;
  --white: #ffffff;
  --lightGray: #d1d5db;
  --gray: #808080;
  --deepGray: #0a0a0f;
  --lightDark: #313131;
  --dark: #101017;
  --deepDark: #050507;
  --lose: #ff0000;
}

.meal-card {
  position: relative;
  background-color: var(--deepGray);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0);
  border: 1px solid transparent;
}

.meal-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 0;
}

.meal-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary);
  z-index: 1;
}

.meal-card:hover::before {
  opacity: 0.1;
}

.meal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: all 0.5s;
  position: relative;
  z-index: 1;
}

.meal-card:hover .meal-image {
  transform: scale(1.1);
  filter: brightness(1.1) contrast(1.1);
}

.meal-info {
  padding: 20px;
  position: relative;
  z-index: 2;
  background-color: var(--deepGray);
}

.meal-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--white);
  font-size: 18px;
  position: relative;
  display: inline-block;
  transition: all 0.3s;
}

.meal-info h3::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: all 0.3s ease;
}

.meal-card:hover h3 {
  color: var(--primary);
}

.meal-card:hover h3::after {
  width: 100%;
}

.recipe-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: var(--gray);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0;
  line-height: 1;
  z-index: 10;
  position: relative;
}

.favorite-btn:hover {
  transform: scale(1.3) rotate(10deg);
}

.favorite-btn.active {
  color: var(--primary);
  animation: heartBeat 1s;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.favorite-btn i {
  font-size: 22px;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}

.meal-info p {
  color: var(--lightGray);
  margin: 8px 0;
  font-size: 14px;
  position: relative;
  transition: all 0.3s;
}

.meal-card:hover p {
  color: var(--white);
}

.meal-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.small-flag {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.meal-card:hover .small-flag {
  transform: scale(1.2);
}

.view-recipe-btn {
  background: linear-gradient(135deg, var(--primary), var(--primaryHover));
  color: var(--white);
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  width: 100%;
  font-weight: bold;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
}

.view-recipe-btn::before {
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

.view-recipe-btn:hover::before {
  left: 100%;
}

.view-recipe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(134, 190, 66, 0.3);
}

@media (max-width: 768px) {
  .meal-card {
    max-width: 350px;
    margin: 0 auto;
  }
}
</style>
