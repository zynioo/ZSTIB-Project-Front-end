import { ref, reactive } from 'vue';

export const useRecipeStore = () => {
  const meals = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const favorites = ref([]);
  const selectedMeal = ref(null);
  const searchType = ref('name'); // 'name', 'category', 'ingredient'
  const searchQuery = ref('');

  // Inicjalizacja ulubionych z localStorage
  const initFavorites = () => {
    const storedFavorites = localStorage.getItem('favoriteMeals');
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites);
    }
  };

  // Zapisywanie ulubionych do localStorage
  const saveFavorites = () => {
    localStorage.setItem('favoriteMeals', JSON.stringify(favorites.value));
  };

  // Dodawanie do ulubionych
  const addToFavorites = (meal) => {
    if (!favorites.value.some(fav => fav.idMeal === meal.idMeal)) {
      favorites.value.push(meal);
      saveFavorites();
    }
  };

  // Usuwanie z ulubionych
  const removeFromFavorite = (mealId) => {
    favorites.value = favorites.value.filter(meal => meal.idMeal !== mealId);
    saveFavorites();
  };

  // Sprawdzanie czy przepis jest w ulubionych
  const isFavorite = (mealId) => {
    return favorites.value.some(meal => meal.idMeal === mealId);
  };

  // Pobieranie kategorii
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      categories.value = data.categories || [];
    } catch (err) {
      error.value = 'Nie udało się pobrać kategorii';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Wyszukiwanie przepisów
  const searchMeals = async () => {
    if (!searchQuery.value) return;
    
    loading.value = true;
    error.value = null;
    meals.value = [];
    
    try {
      let url;
      switch (searchType.value) {
        case 'name':
          url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery.value)}`;
          break;
        case 'category':
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(searchQuery.value)}`;
          break;
        case 'ingredient':
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(searchQuery.value)}`;
          break;
      }

      const response = await fetch(url);
      const data = await response.json();
      meals.value = data.meals || [];
    } catch (err) {
      error.value = 'Nie udało się wyszukać przepisów';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Wyszukiwanie przepisów po kategorii
  const searchByCategory = async (category) => {
    loading.value = true;
    error.value = null;
    meals.value = [];
    
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
      const response = await fetch(url);
      const data = await response.json();
      meals.value = data.meals || [];
    } catch (err) {
      error.value = 'Nie udało się wyszukać przepisów dla tej kategorii';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Pobieranie szczegółów przepisu
  const fetchMealDetails = async (mealId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        selectedMeal.value = data.meals[0];
      } else {
        error.value = 'Nie znaleziono szczegółów przepisu';
      }
    } catch (err) {
      error.value = 'Nie udało się pobrać szczegółów przepisu';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    meals,
    categories,
    loading,
    error,
    favorites,
    selectedMeal,
    searchType,
    searchQuery,
    initFavorites,
    addToFavorites,
    removeFromFavorite,
    isFavorite,
    fetchCategories,
    searchMeals,
    searchByCategory,
    fetchMealDetails
  };
};