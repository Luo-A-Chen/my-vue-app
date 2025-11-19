<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <span>主菜单</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>用户管理</span>
            </span>
          </template>
          <a-menu-item key="3">用户列表</a-menu-item>
          <a-menu-item key="4">角色管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>队伍管理</span>
            </span>
          </template>
          <a-menu-item key="6">battle小队</a-menu-item>
          <a-menu-item key="8">聊天小队</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>文件管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; justify-content: space-between; align-items: center;">
        <template v-if="isLoggedIn">
          <a-dropdown>
            <div style="display: flex; align-items: center;">
              <a-avatar :size="32" :src="userInfo.avatar">
                {{ userInfo.name?.charAt(0) || 'U' }}
              </a-avatar>
              <span style="margin-left: 8px;">
                {{ userInfo.name }}
              </span>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleEditProfile">
                  <user-outlined /> 编辑个人信息
                </a-menu-item>

                <a-menu-divider />

                <a-menu-item @click="handleLogout">
                  <logout-outlined /> 退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>

        <template v-else>
          <router-link to="/login">
            <a-button type="primary" size="small">登录</a-button>
          </router-link>
          <router-link to="/register">
            <a-button type="primary" size="small">注册</a-button>
          </router-link>
        </template>
      </a-layout-header>

      <a-layout-content style="margin: 0 16px">
        <router-view />
      </a-layout-content>

      <a-layout-footer style="text-align: center">
         Created by NeTimeCo
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>


<script lang="ts" setup>
import {
  DesktopOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import {computed, ref} from 'vue';
import router from "./router";
import {useUserStore} from "./store.ts";

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const userStore = useUserStore()

// 检查登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
// 获取用户信息
const userInfo = computed(() =>
    userStore.userInfo || {name:'用户',avatar:''})
// 编辑个人信息
const handleEditProfile = () => {
  router.push('/edit');
};
// 退出登录
const handleLogout = () => {
  userStore.logout();
  setTimeout(()=>{
    router.push('/login');
  },0)
};
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

/* 头像悬停效果 */
.a-avatar:hover {
  opacity: 0.8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}
</style>