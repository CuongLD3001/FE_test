<template>
  <div class="container">
    <div class="content-container">
      <div class="content">
        <div class="p-4">
          <div class="flex space-x-4 mb-4">
            <button @click="startSlideShow" class="button start">Start</button>
            <button @click="stopSlideShow" class="button stop">Stop</button>
            <button @click="speedUp" class="button speed-up">Speed Up</button>
            <button @click="speedDown" class="button speed-down">
              Speed Down
            </button>
            <input
              v-model="inputDelay"
              type="number"
              placeholder="Custom delay (ms)"
              class="input"
            />
            <button @click="setCustomDelay" class="button set-delay">
              Set Delay
            </button>
            <button @click="showInsertForm" class="insert-btn">
              Insert Image
            </button>
            <button @click="showDeleteForm" class="delete-btn">
              Delete Image
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
          <div
            v-if="isInsertFormVisible || isDeleteFormVisible"
            class="overlay"
          ></div>
          <form
            v-if="isInsertFormVisible"
            @submit.prevent="insertImage"
            class="insert-form"
          >
            <label for="imageName">Image Name:</label>
            <input v-model="newImageName" type="text" id="imageName" required />
            <br />
            <label for="imageUrl">Image URL:</label>
            <input v-model="newImageUrl" type="text" id="imageUrl" required />
            <br />
            <button type="submit">Insert Image</button>
            <button type="button" @click="hideInsertForm">Cancel</button>
          </form>
          <form
            v-if="isDeleteFormVisible"
            @submit.prevent="deleteImageById"
            class="insert-form"
          >
            <label for="deleteImageId">Image ID:</label>
            <input
              v-model="deleteImageId"
              type="text"
              id="deleteImageId"
              required
            />
            <br />
            <div class="buttons">
              <button type="submit">Delete Image</button>
              <button type="button" @click="hideDeleteForm">Cancel</button>
            </div>
          </form>
        </div>
      </div>
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
const isInsertFormVisible = ref(false);
const isDeleteFormVisible = ref(false);
const newImageName = ref("");
const newImageUrl = ref("");
const deleteImageId = ref("");
let interval = null;

const fetchImages = async () => {
  try {
    const data = await fetchData(process.env.VUE_APP_URL + "/api/images");
    images.value = data.images;
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const startInterval = () => {
  stopInterval();
  interval = setInterval(() => {
    if (images.value.length === 0) {
      console.warn("No images available");
      return;
    }
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  }, delay.value);
};

const stopInterval = () => {
  clearInterval(interval);
};

const startSlideShow = () => {
  isRunning.value = true;
  startInterval();
};

const stopSlideShow = () => {
  isRunning.value = false;
  stopInterval();
};

const speedUp = () => {
  delay.value = delay.value > 1000 ? delay.value - 1000 : 1000;
  if (isRunning.value) startInterval();
};

const speedDown = () => {
  delay.value += 1000;
  if (isRunning.value) startInterval();
};

const setCustomDelay = () => {
  const newDelay = parseInt(inputDelay.value, 10);
  if (!isNaN(newDelay) && newDelay >= 1000) {
    delay.value = newDelay;
    inputDelay.value = "";
    if (isRunning.value) startInterval();
  }
};

const showInsertForm = () => {
  isInsertFormVisible.value = true;
};

const hideInsertForm = () => {
  isInsertFormVisible.value = false;
  newImageName.value = "";
  newImageUrl.value = "";
};

const insertImage = async () => {
  try {
    const newImage = {
      imageName: newImageName.value,
      url: newImageUrl.value,
    };
    const response = await fetchData(
      process.env.VUE_APP_URL + "/api/images",
      "POST",
      newImage
    );
    images.value.push(response);
    hideInsertForm();
    showSuccessAlert();
    await fetchImages();
  } catch (error) {
    console.error("Error inserting image:", error);
  }
};

const showSuccessAlert = () => {
  const successAlert = document.createElement("div");
  successAlert.textContent = "Insert Successfully!";
  successAlert.classList.add("success-alert");
  document.body.appendChild(successAlert);
};

const showDeleteForm = () => {
  isDeleteFormVisible.value = true;
};

const hideDeleteForm = () => {
  isDeleteFormVisible.value = false;
  deleteImageId.value = "";
};

const deleteImageById = async () => {
  try {
    const idToDelete = parseInt(deleteImageId.value, 10);
    if (isNaN(idToDelete)) {
      console.error("Invalid image ID");
      return;
    }
    const response = await fetchData(
      `${process.env.VUE_APP_URL}/api/images/${idToDelete}`,
      "DELETE"
    );
    if (response.status === 204) {
      showSuccessAlert();
      await fetchImages();
      hideDeleteForm();
    } else {
      console.error("Error deleting image:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

onMounted(() => {
  fetchImages();
});

watchEffect(() => {
  isRunning.value ? startInterval() : stopInterval();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.delete-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.success-alert {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1); /* Thêm scale(1) vào đây */
  background-color: #2ecc71; /* Màu xanh lá cây */
  color: #ffffff; /* Màu chữ trắng */
  padding: 20px;
  border-radius: 8px;
  opacity: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1001; /* Đặt z-index cao hơn so với ảnh */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
/* ... */

.content-container {
  height: 100vh;
  overflow: hidden;
}

.content {
  text-align: center;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  gap: 10px;
}

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
  border: 1px solid #cbd5e0;
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.set-delay {
  background-color: #805ad5;
}

.insert-btn,
.delete-btn {
  background-color: #718096;
  color: #ffffff;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.insert-btn:hover,
.delete-btn:hover {
  background-color: #4a5568;
}

/* Form styling */
/* Form styling */
.insert-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 999; /* Ensure the form is above other elements */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow for better visibility */
}

/* Style for form labels */
.insert-form label {
  font-weight: bold;
  margin-bottom: 5px;
}

/* Style for form inputs */
.insert-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* Style for form buttons */
.insert-form button {
  background-color: #4a5568;
  color: #ffffff;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.insert-form button:hover {
  background-color: #2d3748;
}

/* Overlay styling */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
  z-index: 998; /* Ensure the overlay is below the form */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
  z-index: 998; /* Ensure the overlay is below the form */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
