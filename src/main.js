import { createApp } from 'vue'
import '@/assets/styles/main.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { FontAwesomeIcon } from './plugins/fontawesome'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.component('fa-icon', FontAwesomeIcon)

app.mount('#app')
