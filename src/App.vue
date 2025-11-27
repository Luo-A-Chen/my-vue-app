<template>
  <div id="app">
    <!-- 简约静态背景 -->
    <div class="simple-background"></div>
    
    <!-- 主布局 -->
    <a-layout class="app-layout">
      <!-- 主要内容区域 -->
      <a-layout-content class="main-content">
        <!-- 路由视图容器 -->
        <div class="router-container">
          <router-view />
        </div>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer class="app-footer">
        <div class="footer-content">
          <div class="footer-info">
            <p>© 2025 Beatbox视频站 - 分享最精彩的Beatbox表演</p>
            <p>Created by 
              <a href="https://github.com/Luo-A-Chen" target="_blank" rel="noopener noreferrer" class="footer-link">
                NeTimeCo<--点个小星星吧，谢谢！
              </a>
            </p>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">关于NeTimeCo</a>
            <span class="divider">|</span>
            <a href="#" class="footer-link">联系NeTimeCo</a>
            <span class="divider">|</span>
            <a href="#" class="footer-link">隐私政策</a>
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
// 全局样式和配置
import { onMounted } from 'vue';
import { useUserStore } from "./store.ts";

const userStore = useUserStore();

// 页面加载时的初始化
onMounted(() => {
  console.log('App mounted, user login status:', userStore.isLoggedIn);
});
</script>

<style scoped>
#app {
  position: relative;
  min-height: 100vh;
  background: #f8f9fa; /* 简约的浅灰色背景 */
}

.simple-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    /* 简约的几何图案背景 */
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%);
  background-color: #f8f9fa;
  z-index: -1;
}

.app-layout {
  min-height: 100vh;
  background: transparent;
}

.main-content {
  background: transparent;
  padding: 0;
  position: relative;
}

.router-container {
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
}

.app-footer {
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 80px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.footer-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #1890ff;
  text-decoration: underline;
}

.divider {
  color: #ccc;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 16px;
  }
  
  .footer-links {
    justify-content: center;
  }
  
  .footer-info p {
    font-size: 12px;
  }
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style>
/* 全局样式重置和优化 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  background: #f8f9fa;
}

/* Ant Design 组件样式优化 - 简约风格 */
.ant-layout {
  background: transparent !important;
}

.ant-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
}

.ant-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease;
}

.ant-btn-primary {
  background: #1890ff !important;
  border-color: #1890ff !important;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.ant-btn-primary:hover {
  background: #40a9ff !important;
  border-color: #40a9ff !important;
}

.ant-input {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid #d9d9d9 !important;
}

.ant-menu {
  background: rgba(255, 255, 255, 0.95) !important;
}

/* 优化图片加载性能 */
img {
  max-width: 100%;
  height: auto;
}

/* 简约的标题样式 */
.section-title {
  color: #262626;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 简约的链接样式 */
.ant-link {
  color: #1890ff;
}

.ant-link:hover {
  color: #40a9ff;
}
</style>