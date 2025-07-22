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
const metabaseUrl = 'https://metabase.kizunadata.cloud/public/dashboard/80f68a3c-b4a4-4774-9718-e14910680240'; // reemplaza con tu URL real
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
