<template>
  <div class="recipes-container">
    <div class="view-controls">
      <button
        :class="{ active: activeTab === 'search' }"
        class="view-btn"
        @click="setActiveTab('search')"
      >
        <i class="fas fa-search"></i> Wyszukaj Przepisy
      </button>
      <button
        :class="{ active: activeTab === 'favorites' }"
        class="view-btn"
        @click="setActiveTab('favorites')"
      >
        <i class="fas fa-heart"></i> Ulubione
        <span v-if="favoritesCount > 0" class="fav-count">{{
          favoritesCount
        }}</span>
      </button>
    </div>
    <div class="content">
      <RecipesSearchView v-if="activeTab === 'search'" @view-meal="viewMeal" />
      <RecipesFavouritesView
        v-if="activeTab === 'favorites'"
        @view-meal="viewMeal"
      />
    </div>
    <MealDescriptionView
      v-if="selectedMeal"
      :meal="selectedMeal"
      @close="selectedMeal = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import RecipesSearchView from "./RecipesSearchView.vue";
import RecipesFavouritesView from "./RecipesFavouritesView.vue";
import MealDescriptionView from "./MealDescriptionView.vue";

// Load Font Awesome
const loadFontAwesome = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
  document.head.appendChild(link);
};

onMounted(() => {
  loadFontAwesome();
});

const activeTab = ref("search");
const selectedMeal = ref(null);

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

const viewMeal = (meal: any) => {
  selectedMeal.value = meal;
};

// Compute the count of favorite meals
const favoritesCount = ref(0);

// Funkcja do aktualizacji licznika ulubionych
const updateFavoritesCount = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem("favoriteMeals") || "[]");
    favoritesCount.value = favorites.length;
  } catch (error) {
    console.error("Error updating favorites count:", error);
    favoritesCount.value = 0;
  }
};

// Funkcja obsługująca zdarzenie zmiany ulubionych
const handleFavoritesChange = () => {
  updateFavoritesCount();
};

onMounted(() => {
  loadFontAwesome();
  updateFavoritesCount();

  // Nasłuchujemy na zmiany w ulubionych
  window.addEventListener("storage", handleFavoritesChange);
  window.addEventListener("favoritesUpdated", handleFavoritesChange);
});

onUnmounted(() => {
  window.removeEventListener("storage", handleFavoritesChange);
  window.removeEventListener("favoritesUpdated", handleFavoritesChange);
});
</script>

<style scoped>
:root {
  --primary: #86be42; /*Aktualnie jak na stronie zstib    #079211,    #02a30d*/
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

.recipes-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
  background-color: var(--dark);
  color: var(--white);
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.recipes-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--deepDark) 0%, var(--dark) 100%);
  opacity: 0.7;
  z-index: -1;
}

.view-controls {
  display: flex;
  margin-bottom: 0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 -2px 20px rgba(134, 190, 66, 0.2);
  position: relative;
  z-index: 5;
}

.view-btn {
  flex: 1;
  padding: 16px 24px;
  background-color: var(--lightDark);
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  color: var(--lightGray);
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.view-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(134, 190, 66, 0.2),
    transparent
  );
  transition: all 0.6s;
}

.view-btn:hover::before {
  left: 100%;
}

.view-btn.active {
  background: var(--primary);
  color: var(--white);
  box-shadow: 0 5px 15px rgba(134, 190, 66, 0.4);
  transform: translateY(-3px);
}

.view-btn:hover:not(.active) {
  background-color: var(--deepGray);
  transform: translateY(-2px);
}

.view-btn i {
  margin-right: 8px;
  font-size: 14px;
}

.fav-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  color: var(--primary);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  margin-left: 8px;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(134, 190, 66, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(134, 190, 66, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(134, 190, 66, 0);
  }
}

.content {
  background-color: var(--deepGray);
  border-radius: 0 0 10px 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 25px;
  position: relative;
  margin-top: -1px;
  border-top: 3px solid var(--primary);
  transition: all 0.3s ease-in-out;
}

@media (max-width: 768px) {
  .view-btn {
    padding: 12px 15px;
    font-size: 14px;
  }

  .view-btn i {
    margin-right: 5px;
  }

  .content {
    padding: 15px;
  }
}
</style>
