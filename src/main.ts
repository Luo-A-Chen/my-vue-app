import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from "./router";
import { useUserStore } from './store';

const app = createApp(App);
const pinia = createPinia();

app.use(Antd)
   .use(router)
   .use(pinia);

// 应用挂载后初始化用户状态
app.mount('#app');

// 确保用户状态正确初始化
const userStore = useUserStore();
console.log('应用启动时的用户状态:');
console.log('- token:', userStore.token);
console.log('- userInfo:', userStore.userInfo);
console.log('- isLoggedIn:', userStore.isLoggedIn);

// 如果发现状态不一致，强制刷新
const storedToken = localStorage.getItem('UserToken');
const storedUserInfo = localStorage.getItem('UserInfo');

if (storedToken && !userStore.token) {
    console.log('检测到 token 状态不一致，强制刷新');
    userStore.refreshUserInfo();
}

if (storedUserInfo && storedUserInfo !== 'null' && !userStore.userInfo) {
    console.log('检测到用户信息状态不一致，强制刷新');
    userStore.refreshUserInfo();
}
