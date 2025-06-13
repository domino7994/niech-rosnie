import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadTokenFromStorage } from './auth'

loadTokenFromStorage(); // tylko to wystarczy

createApp(App).use(router).mount('#app')
