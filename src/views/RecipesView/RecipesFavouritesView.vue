<template>
  <div class="favorites-container">
    <div v-if="favorites.length === 0" class="no-favorites">
      <i class="far fa-heart empty-heart"></i>
      <h3>Brak Ulubionych Dań</h3>
      <p>
        Zacznij dodawać swoje ulubione dania klikając ikonę serca przy
        przepisach, które lubisz!
      </p>
    </div>

    <div v-else class="favorites-content">
      <h2>Twoje Ulubione Dania</h2>
      <div class="meals-grid">
        <MealView
          v-for="meal in favorites"
          :key="meal.idMeal"
          :meal="meal"
          @view-details="viewMealDetails"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import MealView from "./MealView.vue";

const favorites = ref([]);
const emit = defineEmits(["view-meal"]);

// Funkcja do ładowania ulubionych
const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem("favoriteMeals");
    if (savedFavorites) {
      favorites.value = JSON.parse(savedFavorites);
    } else {
      favorites.value = [];
    }
  } catch (error) {
    console.error("Error loading favorites:", error);
    favorites.value = [];
  }
};

// UPROSZCZONA funkcja obsługi zdarzenia favoritesUpdated
const handleFavoritesChange = () => {
  // Po prostu przeładuj całą listę ulubionych z localStorage
  loadFavorites();
};

onMounted(() => {
  loadFavorites();
  window.addEventListener("storage", handleFavoritesChange);
  window.addEventListener("favoritesUpdated", handleFavoritesChange);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleFavoritesChange);
  window.removeEventListener("favoritesUpdated", handleFavoritesChange);
});

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

// UPROSZCZONA funkcja toggleFavorite
const toggleFavorite = (meal: any) => {
  try {
    // 1. Usuń posiłek z localStorage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favoriteMeals") || "[]"
    );
    const newStoredFavorites = storedFavorites.filter(
      (fav: any) => fav.idMeal !== meal.idMeal
    );
    localStorage.setItem("favoriteMeals", JSON.stringify(newStoredFavorites));

    // 2. Usuń posiłek z lokalnej tablicy w komponencie
    favorites.value = favorites.value.filter(
      (item) => item.idMeal !== meal.idMeal
    );

    // 3. Emituj zdarzenie
    window.dispatchEvent(new Event("favoritesUpdated"));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
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

.favorites-container {
  padding: 20px 0;
}

.favorites-content h2 {
  margin-bottom: 30px;
  color: var(--white);
  text-align: center;
  font-size: 28px;
  position: relative;
  padding-bottom: 15px;
  letter-spacing: 1px;
}

.favorites-content h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(
    to right,
    transparent,
    var(--primary),
    transparent
  );
}

.meals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px;
  text-align: center;
  background-color: var(--deepGray);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--lightDark);
  animation: pulseBackground 3s infinite alternate;
}

@keyframes pulseBackground {
  from {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  to {
    box-shadow: 0 10px 30px rgba(134, 190, 66, 0.3);
  }
}

.no-favorites::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(134, 190, 66, 0.1) 0%,
    transparent 70%
  );
  animation: rotate 20s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-heart {
  font-size: 80px;
  color: var(--lightDark);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  animation: heartBeat 3s infinite alternate;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
    color: var(--lightDark);
  }
  100% {
    transform: scale(1.1);
    color: var(--primary);
  }
}

.no-favorites h3 {
  margin: 15px 0;
  color: var(--white);
  font-size: 26px;
  position: relative;
  z-index: 1;
}

.no-favorites p {
  color: var(--lightGray);
  max-width: 500px;
  position: relative;
  z-index: 1;
  line-height: 1.6;
  font-size: 16px;
}

@media (max-width: 768px) {
  .favorites-content h2 {
    font-size: 24px;
  }

  .no-favorites {
    padding: 60px 20px;
  }

  .empty-heart {
    font-size: 60px;
  }
}
</style>
