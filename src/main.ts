import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from "./router";

createApp(App)
    .use(Antd)
    .use(router)
    .use(createPinia())
    .mount('#app')
