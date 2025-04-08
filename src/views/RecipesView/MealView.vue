<template>
  <div class="meal-card" @click="viewRecipe">
    <div class="meal-image">
      <img :src="meal.strMealThumb" :alt="meal.strMeal" />
    </div>
    <div class="meal-info">
      <div class="meal-content">
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
        <div class="meal-details">
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
        </div>
      </div>
      <div class="button-container">
        <button class="view-recipe-btn" @click="viewRecipe">
          Zobacz Przepis
        </button>
      </div>
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

const isFavorite = ref(false);

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

const handleFavoritesChange = () => {
  checkFavoriteStatus();
};

onMounted(() => {
  checkFavoriteStatus();
  window.addEventListener("storage", handleFavoritesChange);
  window.addEventListener("favoritesUpdated", handleFavoritesChange);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleFavoritesChange);
  window.removeEventListener("favoritesUpdated", handleFavoritesChange);
});

watch(
  () => props.meal?.idMeal,
  async () => {
    checkFavoriteStatus();

    if (
      props.meal &&
      props.meal.idMeal &&
      (!props.meal.strCategory || !props.meal.strArea)
    ) {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${props.meal.idMeal}`
        );
        const data = await response.json();

        if (data.meals && data.meals[0]) {
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
    const favorites = JSON.parse(localStorage.getItem("favoriteMeals") || "[]");
    const existingIndex = favorites.findIndex(
      (fav) => fav.idMeal === props.meal.idMeal
    );

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      isFavorite.value = false;
    } else {
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

    localStorage.setItem("favoriteMeals", JSON.stringify(favorites));

    window.dispatchEvent(new Event("favoritesUpdated"));

    emit("toggle-favorite", props.meal);
  } catch (error) {
    console.error("Error toggling favorite:", error);
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
};

const getCountryCode = (cuisine) => {
  return cuisineToCountryCode[cuisine];
};

const getCountryFlag = (cuisine) => {
  const countryCode = cuisineToCountryCode[cuisine] || "un";
  return `https://flagcdn.com/${countryCode}.svg`;
};
</script>

<style scoped>
.meal-card {
  position: relative;
  background-color: var(--deepGray);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0);
  border: 1px solid transparent;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box; /* Gwarantuje, że padding i border są wliczane w szerokość */
  width: 100%; /* Pełna szerokość kontenera */
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
  height: 0;
  padding-top: 66.67%; /* Proporcja 3:2 */
  position: relative;
  overflow: hidden;
}

.meal-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s;
  z-index: 1;
}

.meal-card:hover .meal-image img {
  transform: scale(1.1);
  filter: brightness(1.1) contrast(1.1);
}

.meal-info {
  padding: 20px;
  position: relative;
  z-index: 2;
  background-color: var(--deepGray);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.meal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.button-container {
  width: 100%;
  margin-top: auto;
}

.recipe-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

.meal-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--white);
  font-size: 18px;
  position: relative;
  transition: all 0.3s;
  line-height: 1.4;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
  padding-right: 10px;
  width: calc(100% - 30px); /* Odjęcie miejsca na ikonę serca */
  box-sizing: border-box;
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

.meal-details {
  flex: 1;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  width: 100%;
  font-weight: bold;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Media queries dla responsywności */
@media (max-width: 1200px) {
  .meal-card {
    min-height: 400px;
  }
}

@media (max-width: 992px) {
  .meal-card {
    min-height: 380px;
  }
}

@media (max-width: 768px) {
  .meal-card {
    min-height: 420px;
    max-width: 400px;
    margin: 0 auto;
  }

  .meal-info {
    padding: 15px;
  }

  .meal-content {
    margin-bottom: 10px;
  }
}

@media (max-width: 576px) {
  .meal-card {
    min-height: 380px;
    max-width: 100%;
  }

  .meal-info {
    padding: 12px;
  }

  .meal-info h3 {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .meal-info p {
    font-size: 13px;
    margin: 6px 0;
  }

  .meal-details {
    min-height: 50px;
  }

  .button-container {
    margin-top: 10px;
  }

  .view-recipe-btn {
    height: 40px;
    font-size: 12px;
    padding: 10px 15px;
  }
}

@media (max-width: 375px) {
  .meal-card {
    min-height: 360px;
  }

  .meal-info {
    padding: 10px;
  }

  .favorite-btn i {
    font-size: 18px;
  }
}
</style>
