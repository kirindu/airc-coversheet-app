import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import TrailerAPI from "@/api/TrailerAPI.js";

export const useTrailersStore = defineStore("trailers", () => {
  const trailers = ref([]);
  const loading = ref(false);
  const error = ref("");

  onMounted(async () => {
    loading.value = true;

    try {
      const { data } = await TrailerAPI.all();
     // trailers.value = data.data; // Recuerda que data es el wrap de axios
     trailers.value = data.data.sort((a, b) => Number(a.trailerNumber) - Number(b.trailerNumber));

    } catch (err) {
      error.value = `Ocurrio el siguiente error al intentar llamar al servicio de trailer: ${err}`;
    } finally {
      loading.value = false;
    }
  });

  return {
    trailers,
    loading,
    error,
  };
});
