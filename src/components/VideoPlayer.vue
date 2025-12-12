<template>
  <div class="modern-video-player">
    <!-- 顶部导航 -->
    <header class="player-header">
      <div class="header-container">
        <div class="header-left">
          <a-button type="text" @click="goBack" class="back-btn">
            <ArrowLeftOutlined />
          </a-button>
          <div class="header-title">
            <h1>{{ videoInfo.title || '视频播放' }}</h1>
          </div>
        </div>
        <div class="header-actions">
          <a-button type="text" class="action-btn">
            <ShareAltOutlined />
          </a-button>
          <a-button type="text" class="action-btn">
            <HeartOutlined />
          </a-button>
          <a-button type="text" class="action-btn">
            <MoreOutlined />
          </a-button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <div class="player-container">
      <div class="player-content">
        <!-- 左侧视频播放区域 -->
        <div class="video-section">
          <!-- 视频播放器 -->
          <div class="video-player-wrapper">
            <a-spin :spinning="loading" class="video-loading">
              <video
                ref="videoPlayer"
                :src="videoInfo.videoUrl"
                controls
                class="video-player"
                @loadstart="handleVideoLoadStart"
                @loadeddata="handleVideoLoaded"
                @error="handleVideoError"
                preload="metadata"
              >
                您的浏览器不支持视频播放
              </video>
            </a-spin>
          </div>

          <!-- 视频信息 -->
          <div class="video-info-card">
            <div class="video-header">
              <h1 class="video-title">{{ videoInfo.title }}</h1>
              <div class="video-meta">
                <span class="meta-item">
                  <EyeOutlined />
                  {{ videoInfo.views || 0 }} 观看
                </span>
                <span class="meta-item">
                  <ClockCircleOutlined />
                  {{ videoInfo.durationDisplay }}
                </span>
                <span class="meta-item">
                  <CalendarOutlined />
                  {{ formatDate(videoInfo.createTime) }}
                </span>
              </div>
            </div>

            <div class="video-actions">
              <a-button type="primary" class="action-button like-btn">
                <HeartOutlined />
                点赞 {{ videoInfo.likes || 0 }}
              </a-button>
              <a-button class="action-button">
                <ShareAltOutlined />
                分享
              </a-button>
              <a-button class="action-button">
                <DownloadOutlined />
                下载
              </a-button>
              <a-button class="action-button">
                <FlagOutlined />
                举报
              </a-button>
            </div>

            <!-- 视频描述 -->
            <div class="video-description" v-if="videoInfo.description">
              <h3>视频描述</h3>
              <p class="description-text">{{ videoInfo.description }}</p>
            </div>

            <!-- 创作者信息 -->
            <div class="creator-info">
              <div class="creator-avatar">
                <a-avatar :size="48" :src="creatorInfo.avatar">
                  {{ creatorInfo.name?.charAt(0) || 'U' }}
                </a-avatar>
              </div>
              <div class="creator-details">
                <h4 class="creator-name">{{ creatorInfo.name || '未知创作者' }}</h4>
                <p class="creator-stats">{{ creatorInfo.followers || 0 }} 粉丝</p>
              </div>
              <a-button type="primary" class="follow-btn">
                关注
              </a-button>
            </div>
          </div>
        </div>

        <!-- 右侧推荐视频 -->
        <div class="recommendations-section">
          <div class="recommendations-card">
            <h2 class="recommendations-title">相关推荐</h2>
            <div class="recommendations-list">
              <div 
                v-for="video in recommendedVideos" 
                :key="video.id"
                class="recommendation-item"
                @click="playRecommendedVideo(video)"
              >
                <div class="recommendation-thumbnail">
                  <img :src="video.cover" :alt="video.title" @error="handleImageError" />
                  <div class="recommendation-duration">{{ formatDuration(video.duration) }}</div>
                </div>
                <div class="recommendation-info">
                  <h4 class="recommendation-title">{{ video.title }}</h4>
                  <p class="recommendation-uploader">{{ video.uploader || '未知创作者' }}</p>
                  <div class="recommendation-meta">
                    <span>{{ video.views || 0 }} 观看</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 广告区域 -->
          <div class="ad-card">
            <div class="ad-content">
              <h4>🎵 Beatbox 进阶课程</h4>
              <p>专业导师一对一指导</p>
              <a-button type="primary" size="small">立即报名</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../auth';
import { message } from 'ant-design-vue';
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  MoreOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FlagOutlined
  // PlayCircleOutlined  // 移除未使用的导入
} from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();

// 视频播放器引用
const videoPlayer = ref<HTMLVideoElement>();

// 加载状态
const loading = ref(true);

// 视频信息
const videoInfo = reactive({
  id: '',
  title: '',
  description: '',
  cover: '',
  videoUrl: '',
  duration: 0,
  durationDisplay: '',
  views: 0,
  likes: 0,
  createTime: '',
  uploader: '',
  status: 0,
  type: 0
});

// 创作者信息
const creatorInfo = reactive({
  name: '',
  avatar: '',
  followers: 0
});

// 推荐视频列表
const recommendedVideos = ref<any[]>([]);

// 获取视频ID
const videoId = computed(() => route.params.id as string);

// 格式化时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN');
};

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E暂无图片%3C/text%3E%3C/svg%3E';
};

// 视频加载开始
const handleVideoLoadStart = () => {
  loading.value = true;
};

// 视频加载完成
const handleVideoLoaded = () => {
  loading.value = false;
  if (videoPlayer.value) {
    videoInfo.durationDisplay = formatDuration(videoPlayer.value.duration || videoInfo.duration);
  }
};

// 视频加载错误
const handleVideoError = () => {
  loading.value = false;
  message.error('视频加载失败，请稍后重试');
};

// 获取视频详情
const fetchVideoDetail = async () => {
  try {
    loading.value = true;
    console.log('获取视频详情，ID:', videoId.value);
    
    // 尝试不同的接口路径，因为后端可能没有详情接口
    // 先尝试从首页推荐接口获取视频信息
    const response = await api.get('/home/recommend');
    console.log('视频详情响应:', response);
    
    if (response && (response as any).code === 200 && (response as any).data) {
      const videos = (response as any).data || [];
      const video = videos.find((v: any) => v.id.toString() === videoId.value);
      
      if (video) {
        Object.assign(videoInfo, {
          ...video,
          durationDisplay: formatDuration(video.duration),
          uploader: video.uploader || '未知创作者',
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100)
        });
        
        // 设置创作者信息
        creatorInfo.name = video.uploader || '未知创作者';
        creatorInfo.followers = Math.floor(Math.random() * 500);
        
        console.log('视频信息已更新:', videoInfo);
      } else {
        message.error('未找到指定视频');
        router.back();
      }
    } else {
      message.error('获取视频详情失败');
      router.back();
    }
  } catch (error: any) {
    console.error('获取视频详情失败:', error);
    message.error('获取视频详情失败');
    router.back();
  } finally {
    loading.value = false;
  }
};

// 获取推荐视频
const fetchRecommendedVideos = async () => {
  try {
    const response = await api.get('/home/recommend');
    if (response && (response as any).code === 200) {
      recommendedVideos.value = ((response as any).data || [])
        .filter((video: any) => video.id !== videoId.value) // 排除当前视频
        .slice(0, 10); // 只取前10个
    }
  } catch (error) {
    console.error('获取推荐视频失败:', error);
  }
};

// 播放推荐视频
const playRecommendedVideo = (video: any) => {
  router.push(`/video-player/${video.id}`);
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 页面加载时获取数据
onMounted(() => {
  if (videoId.value) {
    fetchVideoDetail();
    fetchRecommendedVideos();
  } else {
    message.error('视频ID无效');
    router.back();
  }
});
</script>

<style scoped>
/* 全局样式 */
.modern-video-player {
  min-height: 100vh;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航 */
.player-header {
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #1890ff;
}

.header-title h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #1890ff;
}

/* 主要内容 */
.player-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.player-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  padding: 24px 0;
  align-items: start;
}

/* 视频播放区域 */
.video-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-player-wrapper {
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
}

.video-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* 视频信息卡片 */
.video-info-card {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  color: #fff;
}

.video-header {
  margin-bottom: 20px;
}

.video-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.video-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #bbb;
}

.video-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.action-button {
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.like-btn {
  background: #ff4757;
  border-color: #ff4757;
}

.like-btn:hover {
  background: #ff3838;
  border-color: #ff3838;
}

.video-description {
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.video-description h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.description-text {
  margin: 0;
  font-size: 14px;
  color: #ccc;
  line-height: 1.6;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.creator-details {
  flex: 1;
}

.creator-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.creator-stats {
  margin: 0;
  font-size: 12px;
  color: #bbb;
}

.follow-btn {
  border-radius: 20px;
  font-weight: 500;
}

/* 推荐视频区域 */
.recommendations-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.recommendations-card {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 20px;
}

.recommendations-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.recommendation-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.recommendation-thumbnail {
  position: relative;
  width: 120px;
  height: 68px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.recommendation-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommendation-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.recommendation-info {
  flex: 1;
  min-width: 0;
}

.recommendation-title {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommendation-uploader {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #bbb;
}

.recommendation-meta {
  font-size: 11px;
  color: #999;
}

/* 广告卡片 */
.ad-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  color: white;
}

.ad-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.ad-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .player-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .recommendations-section {
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  
  .recommendations-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  
  .recommendation-item {
    flex-direction: column;
  }
  
  .recommendation-thumbnail {
    width: 100%;
    height: 160px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .header-title h1 {
    font-size: 16px;
    max-width: 200px;
  }
  
  .player-container {
    padding: 0 16px;
  }
  
  .player-content {
    padding: 16px 0;
  }
  
  .video-info-card,
  .recommendations-card {
    padding: 16px;
  }
  
  .video-title {
    font-size: 20px;
  }
  
  .video-actions {
    gap: 8px;
  }
  
  .action-button {
    font-size: 12px;
    padding: 4px 12px;
  }
  
  .recommendations-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-actions {
    display: none;
  }
  
  .video-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .video-actions {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .creator-info {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .follow-btn {
    width: 100%;
  }
}

/* 滚动条样式 */
.recommendations-section::-webkit-scrollbar {
  width: 6px;
}

.recommendations-section::-webkit-scrollbar-track {
  background: #333;
  border-radius: 3px;
}

.recommendations-section::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 3px;
}

.recommendations-section::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>