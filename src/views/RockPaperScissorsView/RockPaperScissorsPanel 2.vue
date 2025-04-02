<template>
  <div class="panel-container">
    <div
      class="image-container"
      @click="userSelect(number)"
      v-for="number in numbers"
      :key="number"
    >
      <img
        class="image"
        :src="
          require(
            `../../assets/Photos/RockPaperScissors/${options[number]}.png`
          )
        "
        alt="HTML"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
let numbers = [0, 1, 2];
const options: string[] = ["rock", "paper", "scissors"];
const emit = defineEmits(["selected"]);
/**
 * This function is used to select the image in the Rock Paper Scissors game
 * @param number - number of the selected image
 */
const userSelect = (number: number) => {
  // Get all image containers
  const imageContainer = document.querySelectorAll(
    ".image-container"
  ) as NodeListOf<HTMLElement>;
  // Remove the selected class from all images
  const selectedImage = imageContainer[number];
  imageContainer.forEach((image) => {
    image.classList.remove("selected");
  });
  // Add the selected class to the clicked image
  selectedImage.classList.add("selected");
  emit("selected", number); // Emit the selected number to the parent component
};
</script>
<style scoped>
.panel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem auto;
  width: 100%;
}
.image-container {
  width: 25%;
  margin: 10px;
}
.image {
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s;
}
.selected {
  border: 3px solid white;
}
@media (max-width: 768px) {
  .image-container {
    width: 30%;
  }
}
@media (max-width: 560px) {
  .panel-container {
    flex-direction: column;
    align-items: center;
  }
  .image-container {
    width: 60%;
  }
}
</style>
