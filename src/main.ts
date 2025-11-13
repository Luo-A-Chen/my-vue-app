import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from "./router";

createApp(App).use(Antd).use(router).mount('#app')
