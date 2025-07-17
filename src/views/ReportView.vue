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
const metabaseUrl = 'http://metabase.kizunadata.cloud:3030/public/dashboard/3e7433c3-6fb0-4d79-91f5-1ac24815e85e'; // reemplaza con tu URL real
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
