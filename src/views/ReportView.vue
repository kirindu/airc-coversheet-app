<template>
  <div class="dashboard-container">
    <iframe
      :src="metabaseUrl"
      width="100%"
      height="900"
      frameborder="0"
      allowtransparency
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// URLs de los diferentes reportes
const reportUrls = {
  'single-date': 'https://metabase.kizunadata.cloud/public/question/8715d61d-e8ff-464c-a69e-8fe2d38e026b',
  'date-range': 'https://metabase.kizunadata.cloud/public/question/8f17d9e6-5eff-4029-8bc7-56acbc3eb256',
  'driver-name': 'https://metabase.kizunadata.cloud/public/question/4a9ffd6f-bbac-4cf7-8b28-79eb60f22de6'
}

// Computed property que determina qué URL usar basado en el parámetro de la ruta
const metabaseUrl = computed(() => {
  const reportType = route.params.type || 'single-date'
  return reportUrls[reportType] || reportUrls['single-date']
})
</script>

<style scoped>
.dashboard-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px;
  margin-top: 80px;
}
</style>