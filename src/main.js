

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Tema oscuro por defecto
dzSettingsOptions.version = 'dark';
new dzSettings(dzSettingsOptions);
document.cookie = "version=dark"; 

app.mount('#app')
