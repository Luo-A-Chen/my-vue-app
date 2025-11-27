<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store';
import { 
  PlayCircleOutlined, 
  HeartOutlined, 
  StarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();

// 用户状态相关
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userInfo = computed(() => userStore.userInfo || { name: '用户', avatar: '' });

// 编辑个人信息
const handleEditProfile = () => {
  router.push('/edit');
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  setTimeout(() => {
    router.push('/login');
  }, 0);
};

// 模拟视频数据
const videoList = ref([
  {
    id: 1,
    title: '世界顶级Beatbox表演 - Codfish',
    thumbnail: 'https://via.placeholder.com/320x180/1890ff/ffffff?text=Codfish',
    videoUrl: 'https://www.youtube.com/embed/example1',
    duration: '3:45',
    views: '1.2M',
    likes: '45K',
    uploader: 'Beatbox World',
    category: '表演',
    difficulty: '高级'
  },
  {
    id: 2,
    title: '初学者Beatbox基础教学',
    thumbnail: 'https://via.placeholder.com/320x180/52c41a/ffffff?text=基础教学',
    videoUrl: 'https://www.youtube.com/embed/example2',
    duration: '8:20',
    views: '890K',
    likes: '32K',
    uploader: 'Beatbox学院',
    category: '教学',
    difficulty: '初级'
  },
  {
    id: 3,
    title: 'Dubstep Beatbox挑战',
    thumbnail: 'https://via.placeholder.com/320x180/fa541c/ffffff?text=Dubstep',
    videoUrl: 'https://www.youtube.com/embed/example3',
    duration: '2:30',
    views: '2.1M',
    likes: '78K',
    uploader: '电子音乐Beatbox',
    category: '挑战',
    difficulty: '中级'
  },
  {
    id: 4,
    title: 'Beatbox世界冠军合集',
    thumbnail: 'https://via.placeholder.com/320x180/722ed1/ffffff?text=世界冠军',
    videoUrl: 'https://www.youtube.com/embed/example4',
    duration: '15:40',
    views: '3.5M',
    likes: '120K',
    uploader: 'Beatbox官方',
    category: '合集',
    difficulty: '高级'
  },
  {
    id: 5,
    title: '日常Beatbox练习技巧',
    thumbnail: 'https://via.placeholder.com/320x180/13c2c2/ffffff?text=练习技巧',
    videoUrl: 'https://www.youtube.com/embed/example5',
    duration: '6:15',
    views: '560K',
    likes: '28K',
    uploader: '练习达人',
    category: '技巧',
    difficulty: '初级'
  },
  {
    id: 6,
    title: '创新Beatbox音效展示',
    thumbnail: 'https://via.placeholder.com/320x180/eb2f96/ffffff?text=创新音效',
    videoUrl: 'https://www.youtube.com/embed/example6',
    duration: '4:50',
    views: '1.8M',
    likes: '65K',
    uploader: '音效大师',
    category: '创新',
    difficulty: '高级'
  }
]);

const featuredVideos = ref(videoList.value.slice(0, 3));
const categories = ref([
  { label: '全部', value: 'all' },
  { label: '教学', value: '教学' },
  { label: '表演', value: '表演' },
  { label: '挑战', value: '挑战' },
  { label: '技巧', value: '技巧' },
  { label: '创新', value: '创新' }
]);

const selectedCategory = ref('all');
const searchText = ref('');

// 过滤视频
const filteredVideos = ref([...videoList.value]);

const filterVideos = () => {
  let filtered = [...videoList.value];
  
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(video => video.category === selectedCategory.value);
  }
  
  if (searchText.value) {
    filtered = filtered.filter(video => 
      video.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      video.uploader.toLowerCase().includes(searchText.value.toLowerCase())
    );
  }
  
  filteredVideos.value = filtered;
};

const playVideo = (video: any) => {
  // 在实际项目中，这里可以打开视频播放模态框
  console.log('播放视频:', video.title);
};

const likeVideo = (video: any) => {
  // 点赞功能
  console.log('点赞视频:', video.title);
};

onMounted(() => {
  console.log('首页加载完成');
});
</script>

<template>
  <a-layout class="home-layout">
    <!-- 头部 -->
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <PlayCircleOutlined class="logo-icon" />
          <span class="logo-text">Beatbox视频站</span>
        </div>
        
        <div class="search-bar">
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索Beatbox视频..."
            @search="filterVideos"
            class="search-input"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
        </div>
        
        <div class="user-actions">
          <template v-if="isLoggedIn">
            <a-dropdown>
              <div style="display: flex; align-items: center; cursor: pointer;">
                <a-avatar :size="32" :src="userInfo.avatar">
                  {{ userInfo.name?.charAt(0) || 'U' }}
                </a-avatar>
                <span style="margin-left: 8px; color: white;">
                  {{ userInfo.name }}
                </span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleEditProfile">
                    <UserOutlined /> 编辑个人信息
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="handleLogout">
                    <LogoutOutlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <router-link to="/login">
              <a-button type="primary" size="small">登录</a-button>
            </router-link>
            <router-link to="/register" style="margin-left: 8px;">
              <a-button type="primary" size="small">注册</a-button>
            </router-link>
          </template>
        </div>
      </div>
    </a-layout-header>

    <!-- 主要内容区域 -->
    <a-layout-content class="content">
      <!-- 轮播图/特色视频 -->
      <div class="featured-section">
        <a-card class="featured-card" :bordered="false">
          <template #title>
            <div class="section-title">
              <FireOutlined class="title-icon" />
              <span>热门推荐</span>
            </div>
          </template>
          
          <a-row :gutter="[16, 16]">
            <a-col :span="8" v-for="video in featuredVideos" :key="video.id">
              <a-card 
                hoverable 
                class="video-card"
                @click="playVideo(video)"
              >
                <template #cover>
                  <img alt="thumbnail" :src="video.thumbnail" />
                </template>
                <template #actions>
                  <HeartOutlined key="like" @click.stop="likeVideo(video)" />
                  <StarOutlined key="favorite" />
                </template>
                
                <a-card-meta :title="video.title">
                  <template #description>
                    <div class="video-meta">
                      <span>{{ video.uploader }}</span>
                      <span class="views">{{ video.views }} 观看</span>
                    </div>
                  </template>
                </a-card-meta>
                
                <div class="video-duration" v-if="video.duration">{{ video.duration }}</div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </div>

      <!-- 分类导航 -->
      <div class="category-section">
        <a-card :bordered="false">
          <div class="category-tabs">
            <a-radio-group v-model:value="selectedCategory" @change="filterVideos" button-style="solid">
              <a-radio-button v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </a-radio-button>
            </a-radio-group>
          </div>
        </a-card>
      </div>

      <!-- 视频列表 -->
      <div class="video-list-section">
        <a-card :bordered="false">
          <template #title>
            <div class="section-title">
              <ClockCircleOutlined class="title-icon" />
              <span>最新视频</span>
            </div>
          </template>
          
          <a-row :gutter="[16, 16]">
            <a-col 
              :xl="6" 
              :lg="8" 
              :md="12" 
              :sm="12" 
              :xs="24" 
              v-for="video in filteredVideos" 
              :key="video.id"
            >
              <a-card 
                hoverable 
                class="video-card"
                @click="playVideo(video)"
              >
                <template #cover>
                  <img alt="thumbnail" :src="video.thumbnail" />
                </template>
                <template #actions>
                  <HeartOutlined key="like" @click.stop="likeVideo(video)" />
                  <StarOutlined key="favorite" />
                </template>
                
                <a-card-meta :title="video.title">
                  <template #description>
                    <div class="video-meta">
                      <span>{{ video.uploader }}</span>
                      <span class="views">{{ video.views }} 观看</span>
                    </div>
                    <div class="video-tags">
                      <a-tag :color="video.difficulty === '高级' ? 'red' : video.difficulty === '中级' ? 'orange' : 'green'">
                        {{ video.difficulty }}
                      </a-tag>
                      <a-tag color="blue">{{ video.category }}</a-tag>
                    </div>
                  </template>
                </a-card-meta>
                
                <div class="video-duration" v-if="video.duration">{{ video.duration }}</div>
              </a-card>
            </a-col>
          </a-row>
          
          <div v-if="filteredVideos.length === 0" class="empty-state">
            <a-empty description="暂无相关视频" />
          </div>
        </a-card>
      </div>
    </a-layout-content>

    <!-- 底部 -->
    <!-- <a-layout-footer class="footer">
      <div class="footer-content">
        <p>© 2024 Beatbox视频站 - 分享最精彩的Beatbox表演</p>
      </div>
    </a-layout-footer> -->
  </a-layout>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  /* 启用GPU加速 */
  transform: translateZ(0);
}

.header {
  background: #001529;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
  /* 优化固定定位性能 */
  transform: translateZ(0);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  /* 优化文本渲染 */
  transform: translateZ(0);
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.search-bar {
  flex: 0 0 400px;
}

.search-input {
  width: 100%;
}

.user-actions {
  display: flex;
  align-items: center;
}

.content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  transform: translateZ(0);
}

.featured-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.title-icon {
  margin-right: 8px;
  color: #1890ff;
}

.video-card {
  height: 100%;
  /* 优化动画性能 */
  transform: translateZ(0);
  will-change: transform;
}

.video-card:hover {
  transform: translateY(-2px) translateZ(0);
  transition: transform 0.3s ease;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.video-duration {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  /* 优化定位性能 */
  transform: translateZ(0);
}

.video-tags {
  margin-top: 8px;
}

.category-section {
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.footer {
  text-align: center;
  padding: 24px 0;
  background: #f0f2f5;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 优化图片加载性能 */
img {
  max-width: 100%;
  height: auto;
  /* 启用GPU加速 */
  transform: translateZ(0);
}

/* 优化滚动性能 */
.scroll-optimized {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  transform: translateZ(0);
}

/* 减少重绘和重排 */
* {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 优化网格布局性能 */
.a-row {
  /* 启用硬件加速 */
  transform: translateZ(0);
}

.a-col {
  /* 优化渲染性能 */
  will-change: transform;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }
  
  .header-content {
    height: 56px;
  }
  
  .search-bar {
    flex: 0 0 200px;
  }
  
  .content {
    padding: 16px;
  }
  
  .section-title {
    font-size: 16px;
  }
}
</style>