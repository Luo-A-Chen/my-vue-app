<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span>Option 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <span>Option 2</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
          </template>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1"></div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <template v-if="isLoggedIn">
            <a-dropdown :trigger="['click']">
              <a-avatar :size="32" style="cursor: pointer;">
                {{ userInfo.name?.charAt(0) || 'U' }}
              </a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleProfile">
                    <user-outlined />
                    个人资料
                  </a-menu-item>
                  <a-menu-item @click="handleSettings">
                    <setting-outlined />
                    设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <router-link to="/login">
              <a-button type="primary">登录</a-button>
            </router-link>
            <router-link to="/register">
              <a-button type="primary">注册</a-button>
            </router-link>
          </template>
        </div>
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
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const isLoggedIn = ref<boolean>(false); // 登录状态
const userInfo = ref({
  name: '用户',
  avatar: '',
});

// 处理个人资料
const handleProfile = () => {
  console.log('打开个人资料页面');
};

// 处理设置
const handleSettings = () => {
  console.log('打开设置页面');
};

// 处理退出登录
const handleLogout = () => {
  console.log('退出登录');
  isLoggedIn.value = false;
  userInfo.value.name = '用户';
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
}
</style>