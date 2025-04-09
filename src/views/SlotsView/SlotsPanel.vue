<template>
  <div class="slots-game-panel-container">
    <div class="slots-machine-top"></div>
    <div class="slots-display">
      <div class="slots-blocks" v-for="number in numbers" :key="number">
        <div 
          class="image-container" 
          v-for="number2 in numbers" 
          :key="number2"
          :class="{ 'spinning': !props.spinEnded }"
        >
          <img
            class="slots-image"
            :src="
              require(
                `../../assets/Photos/SlotsImages/slots${props.drawedNumbers[number][number2]}.png`
              )
            "
            alt="slot image"
          />
        </div>
      </div>
    </div>
    <div class="slots-machine-bottom"></div>
    
    <!-- Completely Redesigned Slot Machine Lever -->
    <div class="lever-container">
      <div class="lever-track"></div>
      <div 
        class="lever" 
        :class="{ 'lever-pulled': leverPulled }" 
        @click="pullLever"
      >
        <div class="lever-grip"></div>
        <div class="lever-rod"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUpdated, watch, ref } from "vue";
const numbers = [0, 1, 2];
const props = defineProps<{
  drawedNumbers: number[][];
  spinEnded: boolean;
  isWin: boolean;
}>();

const leverPulled = ref(false);
const emit = defineEmits(['spin']);

const pullLever = () => {
  if (props.spinEnded) {
    // Emit the spin event, but don't animate the lever yet
    // The parent will decide if the spin is valid and call the animateLever method
    emit('spin', {
      onValid: () => {
        leverPulled.value = true;
        setTimeout(() => {
          leverPulled.value = false;
        }, 1200);
      }
    });
  }
};

onUpdated(() => {
  const divs = document.querySelectorAll(
    ".slots-blocks:nth-child(2) .image-container"
  );
  if (props.spinEnded) {
    if (props.isWin) {
      divs.forEach((div) => {
        div.classList.add("slots-block-win");
        div.classList.remove("slots-block-lose");
      });
    } else {
      divs.forEach((div) => {
        div.classList.add("slots-block-lose");
        div.classList.remove("slots-block-win");
      });
    }
  } else {
    divs.forEach((div) => {
      div.classList.remove("slots-block-win");
      div.classList.remove("slots-block-lose");
    });
  }
});

watch(() => props.isWin, (newVal) => {
  if (newVal && props.spinEnded) {
    setTimeout(() => {
      const winningSlots = document.querySelectorAll(".slots-block-win");
      winningSlots.forEach(slot => {
        slot.classList.add('win-pulse');
      });
    }, 300);
  }
});
</script>
<style scoped>
.slots-game-panel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  height: 100%;
  width: 100%;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  perspective: 800px;
}

.slots-machine-top {
  background: linear-gradient(135deg, #2a2a2a 0%, #000000 100%);
  height: 40px;
  width: 95%;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  margin-bottom: -5px;
  position: relative;
  z-index: 5;
}

.slots-machine-top::before {
  content: '';
  position: absolute;
  width: 90%;
  height: 8px;
  background: linear-gradient(90deg, #ff6b6b, #ffcd3c, #6bff6b, #6b6bff);
  bottom: 5px;
  left: 5%;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.slots-machine-bottom {
  background: linear-gradient(135deg, #2a2a2a 0%, #000000 100%);
  height: 60px;
  width: 95%;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  margin-top: -5px;
}

.slots-display {
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1) inset, 
              0 0 30px rgba(0, 0, 0, 0.5);
  width: 95%;
  transform-style: preserve-3d;
  transform: rotateX(5deg);
  display: flex;
  flex-direction: column;
  border: 2px solid #333;
}

.slots-blocks {
  flex-grow: 1;
  display: flex;
  min-width: 80px;
  width: 90%;
  align-items: center;
  height: 200px;
  margin: 10px auto;
  font-size: 2rem;
  color: white;
  padding: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 3px solid #444;
  border-radius: 8px;
  background: linear-gradient(145deg, #222, #111);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5), 
              0 0 20px rgba(0, 0, 0, 0.3) inset;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  z-index: 5;
}

.slots-image {
  width: 90%;
  object-fit: contain;
  height: 90%;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  transition: transform 0.2s ease;
}

/* Updated Spinning animation - horizontal motion */
.spinning {
  border-color: #888;
  overflow: hidden;
  position: relative;
}

.spinning::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg, 
    rgba(255,255,255,0.1) 0%, 
    rgba(255,255,255,0.2) 25%, 
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0) 51%,
    rgba(255,255,255,0) 100%
  );
  animation: horizontalSpin 0.5s linear infinite;
  pointer-events: none;
}

.spinning .slots-image {
  animation: horizontalShake 0.2s linear infinite;
}

@keyframes horizontalSpin {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes horizontalShake {
  0% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  100% { transform: translateX(-2px); }
}

.slots-block-lose {
  border-color: var(--lose);
  animation: losePulse 1s ease-in-out;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

.slots-block-win {
  border-color: var(--primary);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
}

.win-pulse {
  animation: winPulse 1.5s infinite alternate;
}

@keyframes winPulse {
  0% { 
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.4);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
}

@keyframes losePulse {
  0% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}

@media (max-width: 967px) {
  .slots-blocks {
    height: 230px;
  }
}

@media (max-width: 770px) {
  .slots-blocks {
    height: 170px;
  }
  .slots-machine-top {
    height: 30px;
  }
  .slots-machine-bottom {
    height: 40px;
  }
}

@media (max-width: 570px) {
  .slots-blocks {
    height: 110px;
  }
  .slots-machine-top {
    height: 20px;
  }
  .slots-machine-bottom {
    height: 30px;
  }
}

@media (max-width: 370px) {
  .slots-blocks {
    height: 80px;
  }
  .slots-machine-top, .slots-machine-bottom {
    width: 98%;
  }
  .slots-display {
    width: 98%;
  }
}

/* Completely Redesigned Lever styling */
.lever-container {
  position: absolute;
  right: -80px;
  top: 20%;
  height: 300px;
  width: 60px;
  z-index: 10;
}

.lever-track {
  position: absolute;
  height: 80%;
  width: 20px;
  background: linear-gradient(90deg, #222, #444, #222);
  border-radius: 10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.7);
  border: 2px solid #333;
}

.lever {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: 80px;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lever-rod {
  position: absolute;
  width: 15px;
  height: 80%;
  background: linear-gradient(90deg, #888, #ccc, #888);
  border-radius: 8px;
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  z-index: 1;
}

.lever-grip {
  position: absolute;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #ff3333 0%, #cc0000 70%, #990000 100%);
  border: 3px solid #333;
  border-radius: 50%;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.5),
    0 0 15px rgba(255,0,0,0.2),
    inset 0 0 10px rgba(255,100,100,0.5);
}

.lever-grip::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%);
  border-radius: 50%;
  z-index: 3;
}

.lever-pulled {
  transform: translateY(200%);
}

/* Add a spring effect when the lever returns */
.lever:not(.lever-pulled) {
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lever:hover .lever-grip {
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.5),
    0 0 20px rgba(255,0,0,0.4),
    inset 0 0 10px rgba(255,100,100,0.5);
}

@media (max-width: 1100px) {
  .lever-container {
    right: -60px;
    height: 250px;
    width: 50px;
  }
}

@media (max-width: 767px) {
  .lever-container {
    right: -50px;
    height: 200px;
  }
  
  .lever {
    height: 60px;
  }
  
  .lever-grip {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 570px) {
  .lever-container {
    right: -40px;
    top: 25%;
    height: 150px;
    width: 40px;
  }
  
  .lever-track {
    width: 15px;
  }
  
  .lever {
    height: 50px;
  }
  
  .lever-rod {
    width: 10px;
  }
  
  .lever-grip {
    width: 35px;
    height: 35px;
  }
}

/* Fix for smaller screens */
@media (max-width: 480px) {
  .lever-container {
    position: absolute;
    right: 5px;
    top: 25%;
    height: 120px;
    width: 30px;
  }
  
  .lever-rod {
    height: 70%;
  }
  
  .lever-grip {
    width: 25px;
    height: 25px;
    bottom: 5px;
  }
}
</style>
