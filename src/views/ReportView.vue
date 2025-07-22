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
const metabaseUrl = 'https://metabase.kizunadata.cloud/public/question/8715d61d-e8ff-464c-a69e-8fe2d38e026b'; // reemplaza con tu URL real
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
