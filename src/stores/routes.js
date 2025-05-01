import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import RouteAPI from "@/api/RouteAPI.js";

export const useRoutesStore = defineStore("routes", () => {
  const routes = ref([]);
  const loading = ref(false);
  const error = ref("");

  onMounted(async () => {
    loading.value = true;

    try {
      const { data } = await RouteAPI.all();
      routes.value = data.data; // Recuerda que data es el wrap de axios

      //   console.log(routes.value);
    } catch (err) {
      error.value = `Ocurrio el siguiente error al intentar llamar al servicio de route: ${err}`;
    } finally {
      loading.value = false;
    }
  });

  return {
    routes,
    loading,
    error,
  };
});
