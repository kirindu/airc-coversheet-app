<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Preloader from '@/components/Preloader.vue'

</script>

<template>

  <!-- Aqui va el preloader -->
<Preloader />


      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->

  <RouterView />


</template>
