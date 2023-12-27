<template>
  <div>
    <div>
      <button @click="startSlideShow">Start</button>
      <button @click="stopSlideShow">Stop</button>
      <button @click="speedUp">Speed Up</button>
      <button @click="speedDown">Speed Down</button>
      <input
        v-model="inputDelay"
        type="number"
        placeholder="Custom delay (ms)"
      />
      <button @click="setCustomDelay">Set Delay</button>
    </div>
    <div>
      <img v-if="images.length > 0" :src="images[currentIndex].url" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { fetchData } from "@/utils/axiosFetchApi";

const images = ref([]);
const currentIndex = ref(0);
const isRunning = ref(false);
const delay = ref(5000);
const inputDelay = ref("");

const fetchImages = async () => {
  try {
    const data = await fetchData(process.env.VUE_APP_URL + "/api/images");
    images.value = data;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const startSlideShow = () => {
  isRunning.value = true;
};

const stopSlideShow = () => {
  isRunning.value = false;
};

const speedUp = () => {
  delay.value = delay.value > 1000 ? delay.value - 1000 : 1000;
};

const speedDown = () => {
  delay.value += 1000;
};

const setCustomDelay = () => {
  const newDelay = parseInt(inputDelay.value, 10);
  if (!isNaN(newDelay) && newDelay >= 1000) {
    delay.value = newDelay;
  }
};

let interval = null;

const startInterval = () => {
  interval = setInterval(() => {
    currentIndex.value =
      currentIndex.value === images.value.length - 1
        ? 0
        : currentIndex.value + 1;
  }, delay.value);
};

const stopInterval = () => {
  clearInterval(interval);
};

onMounted(() => {
  fetchImages();
});

watchEffect(() => {
  if (isRunning.value) {
    startInterval();
  } else {
    stopInterval();
  }
});
</script>

<style scoped>
/* Các quy tắc CSS cho component SlideShow */
</style>
