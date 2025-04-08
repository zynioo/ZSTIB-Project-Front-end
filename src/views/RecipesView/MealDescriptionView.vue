<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>

      <div class="meal-header">
        <img :src="meal.strMealThumb" :alt="meal.strMeal" class="meal-image" />
        <div class="meal-title">
          <div class="recipe-title-row">
            <h2>{{ meal.strMeal }}</h2>
            <button
              class="favorite-btn"
              @click="toggleFavorite"
              :class="{ active: isFavorite }"
            >
              <i class="fa-heart" :class="isFavorite ? 'fas' : 'far'"></i>
            </button>
          </div>
          <div class="meal-tags">
            <span class="tag category">{{ meal.strCategory }}</span>
            <span class="tag area">{{ meal.strArea }}</span>
            <span
              v-if="meal.strTags"
              class="tag"
              v-for="tag in tags"
              :key="tag"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>

      <div class="meal-details">
        <div class="ingredients-section">
          <h3>Składniki</h3>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in ingredients" :key="index">
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <span class="ingredient-measure">{{ ingredient.measure }}</span>
            </li>
          </ul>
        </div>

        <div class="instructions-section">
          <h3>Instrukcje</h3>
          <div class="instructions">
            <p
              v-for="(step, index) in instructionSteps"
              :key="index"
              class="instruction-step"
            >
              <span class="step-number">{{ index + 1 }}</span>
              <span>{{ step }}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="meal.strYoutube" class="video-section">
        <h3>Poradnik Wideo</h3>
        <div class="video-container">
          <iframe
            :src="getYoutubeEmbedUrl(meal.strYoutube)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="actions">
        <button class="action-btn" @click="closeModal">Zamknij</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  meal: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

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
  () => {
    checkFavoriteStatus();
  }
);

const closeModal = () => {
  emit("close");
};

const ingredients = computed(() => {
  const result = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = props.meal[`strIngredient${i}`];
    const measure = props.meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      result.push({
        name: ingredient,
        measure: measure || "",
      });
    }
  }

  return result;
});

const tags = computed(() => {
  if (!props.meal.strTags) return [];
  return props.meal.strTags.split(",").map((tag: string) => tag.trim());
});

const instructionSteps = computed(() => {
  if (!props.meal.strInstructions) return [];

  return props.meal.strInstructions
    .split(/\r\n|\n|\r/)
    .filter((step: string) => step.trim() !== "")
    .map((step: string) => step.trim());
});

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";

  const videoId = url.split("v=")[1];
  if (!videoId) return "";

  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

const toggleFavorite = () => {
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
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 5, 7, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background-color: var(--dark);
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid var(--primary);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary);
  border: none;
  width: 36px;
  height: 36px;
  font-size: 24px;
  cursor: pointer;
  color: var(--white);
  z-index: 10;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(134, 190, 66, 0.4);
}

.close-button:hover {
  background-color: var(--primaryHover);
  transform: rotate(90deg);
}

.meal-header {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.meal-image {
  width: 250px;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.5s;
  border: 3px solid var(--primary);
  position: relative;
  overflow: hidden;
}

.meal-image:hover {
  transform: scale(1.03);
  box-shadow: 0 15px 30px rgba(134, 190, 66, 0.3);
}

.meal-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.meal-title h2 {
  margin: 0 0 20px 0;
  font-size: 32px;
  color: var(--white);
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.meal-title h2::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 50px;
  height: 3px;
  background-color: var(--primary);
  transition: all 0.3s;
}

.modal-content:hover .meal-title h2::after {
  width: 100%;
}

.recipe-title-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 32px;
  color: var(--gray);
  transition: all 0.3s;
  padding: 0;
  line-height: 1;
}

.favorite-btn:hover {
  transform: scale(1.2) rotate(10deg);
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

.meal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--white);
  background-color: var(--deepGray);
  transition: all 0.3s;
  border: 1px solid var(--gray);
}

.tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.tag.category {
  background-color: var(--primary);
  border-color: var(--primary);
}

.tag.area {
  background-color: var(--lightDark);
  border-color: var(--lightDark);
}

.meal-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 30px;
}

.ingredients-section,
.instructions-section {
  background-color: var(--deepGray);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  border: 1px solid var(--lightDark);
}

.ingredients-section:hover,
.instructions-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: var(--primary);
}

.ingredients-section h3,
.instructions-section h3,
.video-section h3 {
  margin-top: 0;
  margin-bottom: 25px;
  color: var(--white);
  font-size: 22px;
  position: relative;
  padding-bottom: 10px;
  letter-spacing: 1px;
}

.ingredients-section h3::after,
.instructions-section h3::after,
.video-section h3::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary);
  transition: all 0.3s;
}

.ingredients-section:hover h3::after,
.instructions-section:hover h3::after,
.video-section:hover h3::after {
  width: 100px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed var(--lightDark);
  transition: all 0.3s;
}

.ingredients-list li:hover {
  background-color: rgba(134, 190, 66, 0.1);
  padding-left: 10px;
  padding-right: 10px;
}

.ingredient-name {
  font-weight: bold;
  color: var(--white);
}

.ingredient-measure {
  color: var(--lightGray);
}

.instructions p {
  margin: 0 0 15px 0;
  line-height: 1.7;
  color: var(--lightGray);
}

.instruction-step {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  transition: all 0.3s;
  padding: 10px;
  border-radius: 8px;
}

.instruction-step:hover {
  background-color: var(--dark);
  transform: translateX(5px);
}

.step-number {
  background-color: var(--primary);
  color: var(--white);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(134, 190, 66, 0.4);
  transition: all 0.3s;
}

.instruction-step:hover .step-number {
  transform: scale(1.2);
}

.video-section {
  margin-bottom: 30px;
  position: relative;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 3px solid var(--primary);
  transition: all 0.3s;
}

.video-container:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(134, 190, 66, 0.4);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.action-btn {
  background: linear-gradient(135deg, var(--primary), var(--primaryHover));
  color: var(--white);
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 15px rgba(134, 190, 66, 0.3);
}

.action-btn::before {
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

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px rgba(134, 190, 66, 0.5);
}

@media (max-width: 992px) {
  .modal-content {
    width: 95%;
    padding: 25px;
  }

  .meal-image {
    width: 220px;
    height: 220px;
  }

  .meal-title h2 {
    font-size: 26px;
  }

  .ingredients-section,
  .instructions-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 20px;
    width: 100%;
  }

  .meal-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .meal-image {
    width: 200px;
    height: 200px;
    margin-bottom: 15px;
  }

  .meal-title {
    align-items: center;
  }

  .meal-title h2 {
    font-size: 24px;
    text-align: center;
  }

  .meal-title h2::after,
  .ingredients-section h3::after,
  .instructions-section h3::after,
  .video-section h3::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .recipe-title-row {
    justify-content: center;
  }

  .meal-details {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .meal-tags {
    justify-content: center;
  }

  .ingredients-section h3,
  .instructions-section h3,
  .video-section h3 {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .modal-content {
    padding: 15px;
    border-radius: 10px;
  }

  .close-button {
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    font-size: 20px;
  }

  .meal-image {
    width: 180px;
    height: 180px;
  }

  .meal-title h2 {
    font-size: 22px;
    margin-bottom: 15px;
  }

  .ingredients-section,
  .instructions-section {
    padding: 15px;
  }

  .action-btn {
    padding: 12px 30px;
    font-size: 14px;
  }

  .tag {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
