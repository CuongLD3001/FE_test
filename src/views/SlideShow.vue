<template>
  <div class="p-4">
    <div class="flex space-x-4 mb-4">
      <button @click="startSlideShow" class="button start">Start</button>
      <button @click="stopSlideShow" class="button stop">Stop</button>
      <button @click="speedUp" class="button speed-up">Speed Up</button>
      <button @click="speedDown" class="button speed-down">Speed Down</button>
      <input
        v-model="inputDelay"
        type="number"
        placeholder="Custom delay (ms)"
        class="input"
      />
      <button @click="setCustomDelay" class="button set-delay">
        Set Delay
      </button>
    </div>
    <div>
      <img
        v-if="images.length > 0"
        :src="images[currentIndex].url"
        alt=""
        class="max-w-full"
      />
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
let interval = null;

const fetchImages = async () => {
  try {
    const data = await fetchData(process.env.VUE_APP_URL + "/api/images");
    images.value = data.images;
    console.log("Fetched images:", images.value);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const startInterval = () => {
  stopInterval(); // Stop the previous interval
  interval = setInterval(() => {
    if (images.value.length === 0) {
      console.warn("No images available");
      return;
    }

    currentIndex.value = (currentIndex.value + 1) % images.value.length;
    console.log("Current index:", currentIndex.value);
  }, delay.value);
  console.log("Interval started with delay:", delay.value);
};

const stopInterval = () => {
  clearInterval(interval);
  console.log("Interval stopped");
};

const startSlideShow = () => {
  isRunning.value = true;
  console.log("Slide show started");
  startInterval();
};

const stopSlideShow = () => {
  isRunning.value = false;
  console.log("Slide show stopped");
  stopInterval();
};

const speedUp = () => {
  delay.value = delay.value > 1000 ? delay.value - 1000 : 1000;
  console.log("Speed increased. New delay:", delay.value);
  if (isRunning.value) {
    startInterval();
  }
};

const speedDown = () => {
  delay.value += 1000;
  console.log("Speed decreased. New delay:", delay.value);
  if (isRunning.value) {
    startInterval();
  }
};

const setCustomDelay = () => {
  const newDelay = parseInt(inputDelay.value, 10);
  if (!isNaN(newDelay) && newDelay >= 1000) {
    delay.value = newDelay;
    console.log("Custom delay set:", delay.value);
    inputDelay.value = "";
    if (isRunning.value) {
      startInterval();
    }
  }
};

onMounted(() => {
  fetchImages();
  console.log("Component mounted");
});

watchEffect(() => {
  if (isRunning.value) {
    startInterval();
  } else {
    stopInterval();
  }
  console.log("isRunning:", isRunning.value);
});
</script>

<style scoped>
.button {
  background-color: #4a5568;
  color: #ffffff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.button:hover {
  background-color: #2d3748;
}

.start {
  background-color: #3490dc;
}

.stop {
  background-color: #e3342f;
}

.speed-up {
  background-color: #38a169;
}

.speed-down {
  background-color: #f6993f;
}

.input {
  border: 1px solid #cbd5e0; /* Set your desired border color */
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.set-delay {
  background-color: #805ad5;
}
</style>
