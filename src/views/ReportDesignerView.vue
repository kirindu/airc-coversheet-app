

<script setup>
import { Designer } from '@mescius/activereportsjs-vue';
import '@mescius/activereportsjs/styles/ar-js-ui.css';
import '@mescius/activereportsjs/styles/ar-js-designer.css';


</script>

<template>
  <div style="height: 100vh;">
    <!-- <Viewer v-bind:report="{ Uri: '/reports/report.rdlx.json' }" /> -->
    <!-- <Designer v-bind:report="{ Uri: '/reports/report.rdlx.json', displayName: 'Mi Reporte' }" /> -->
     <Designer />
  </div>
</template>