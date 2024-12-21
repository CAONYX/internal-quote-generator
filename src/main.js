import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { PDFPlugin } from 'vue3-pdfmake';
import { createPinia } from 'pinia';

const app = createApp(App)
app.use(PDFPlugin)
app.use(createPinia())
app.use(router)
app.mount('#app')
