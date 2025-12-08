<template>
  <div class="video-upload-container">
    <a-page-header
      title="上传视频"
      sub-title="分享您的Beatbox精彩表演"
      @back="goBack"
      class="page-header"
    >
      <template #extra>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          发布视频
        </a-button>
      </template>
    </a-page-header>

    <div class="upload-content">
      <a-card title="视频信息" class="upload-card">
        <a-form :model="formState" :rules="rules" ref="formRef" layout="vertical">
          
          <!-- 视频文件上传 -->
          <a-form-item label="视频文件" name="videoFile" required>
            <div class="upload-area">
              <a-upload
                v-model:file-list="fileList"
                :before-upload="beforeUpload"
                :custom-request="customUpload"
                :show-upload-list="false"
                accept="video/*"
                class="video-upload"
              >
                <div class="upload-placeholder" :class="{ 'has-file': fileList.length > 0 }">
                  <template v-if="fileList.length === 0">
                    <div class="upload-icon">
                      <UploadOutlined style="font-size: 48px; color: #1890ff;" />
                    </div>
                    <div class="upload-text">
                      <p>点击或拖拽视频文件到此区域上传</p>
                      <p class="upload-hint">支持MP4、AVI、MOV等格式，最大500MB</p>
                    </div>
                  </template>
                  <template v-else>
                    <div class="file-info">
                      <div class="file-icon">
                        <PlayCircleOutlined style="font-size: 48px; color: #52c41a;" />
                      </div>
                      <div class="file-details">
                        <p class="file-name">{{ fileList[0]?.name || '未知文件' }}</p>
                        <p class="file-size">{{ formatFileSize(fileList[0]?.size || 0) }}</p>
                        <p class="upload-status" :class="{ 'uploading': uploading }">
                          {{ uploading ? '上传中...' : '已选择文件' }}
                        </p>
                      </div>
                    </div>
                  </template>
                </div>
              </a-upload>
              
              <!-- 上传进度条 -->
              <div v-if="uploading" class="upload-progress">
                <a-progress 
                  :percent="uploadProgress" 
                  :show-info="false" 
                  stroke-color="#1890ff" 
                />
                <p class="progress-text">{{ uploadProgress }}%</p>
              </div>
            </div>
          </a-form-item>

          <!-- 视频标题 -->
          <a-form-item label="视频标题" name="title" required>
            <a-input
              v-model:value="formState.title"
              placeholder="请输入视频标题（2-50个字符）"
              :maxlength="50"
              show-count
            />
          </a-form-item>

          <!-- 视频描述 -->
          <a-form-item label="视频描述" name="description">
            <a-textarea
              v-model:value="formState.description"
              placeholder="请输入视频描述（可选，最多200个字符）"
              :rows="4"
              :maxlength="200"
              show-count
            />
          </a-form-item>

        </a-form>
      </a-card>

      <!-- 预览区域 -->
      <a-card title="视频预览" class="preview-card" v-if="fileList.length > 0">
        <div class="preview-content">
          <video 
            v-if="videoPreviewUrl" 
            :src="videoPreviewUrl" 
            controls 
            class="video-preview"
          >
            您的浏览器不支持视频播放
          </video>
          <div v-else class="preview-placeholder">
            <p>选择视频文件后，将在此处显示预览</p>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../auth';
import { message, type FormInstance, type UploadFile } from 'ant-design-vue';
import { 
  UploadOutlined, 
  PlayCircleOutlined 
} from '@ant-design/icons-vue';

const router = useRouter();
const formRef = ref<FormInstance>();

// 表单状态
const formState = reactive({
  title: '',
  description: '',
  videoFile: null as File | null
});

// 文件上传相关
const fileList = ref<UploadFile[]>([]);
const uploading = ref(false);
const uploadProgress = ref(0);
const loading = ref(false);

// 视频预览URL
const videoPreviewUrl = ref('');

// 表单验证规则
const rules = {
  videoFile: [
    { required: true, message: '请选择视频文件', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2-50个字符之间', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ]
};

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 上传前验证
const beforeUpload = (file: File): boolean => {
  // 检查文件类型
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    message.error('只能上传视频文件！');
    return false;
  }

  // 检查文件大小（500MB限制）
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message.error('视频文件不能超过500MB！');
    return false;
  }

  // 保存原生 File 对象到表单字段，用于表单验证和上传
  formState.videoFile = file;

  // 创建预览URL
  if (videoPreviewUrl.value) {
    URL.revokeObjectURL(videoPreviewUrl.value);
  }
  videoPreviewUrl.value = URL.createObjectURL(file);

  // 阻止自动上传，等待用户点击"发布视频"按钮
  return false;
};

// 自定义上传逻辑
const customUpload = async (options: any) => {
  const { onProgress, onSuccess, onError } = options;
  
  uploading.value = true;
  uploadProgress.value = 0;

  try {
    // 检查是否有文件
    if (!formState.videoFile) {
      throw new Error('没有选择视频文件');
    }

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10;
        onProgress({ percent: uploadProgress.value });
      }
    }, 200);

    // 创建FormData - 与后端接口匹配
    const formData = new FormData();
    
    // 创建视频信息对象
    const videoInfo = {
      title: formState.title,
      description: formState.description
    };
    
    // 后端接口要求：@RequestPart("info") VideoRequest req
    formData.append('info', new Blob([JSON.stringify(videoInfo)], { 
      type: 'application/json' 
    }));
    
    // 后端接口要求：@RequestPart("file") MultipartFile file
    // 使用 formState.videoFile 中的原生 File 对象
    formData.append('file', formState.videoFile as File);

    // 调用上传接口
    const response = await api.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadProgress.value = percent;
          onProgress({ percent });
        }
      }
    });

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // 上传成功
    onSuccess(response, formState.videoFile);
    message.success('视频上传成功！');
    
    // 延迟跳转，让用户看到成功消息
    setTimeout(() => {
      router.back();
    }, 1500);

  } catch (error: any) {
    console.error('视频上传失败:', error);
    onError(error);
    message.error('视频上传失败，请重试');
  } finally {
    uploading.value = false;
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证表单
    await formRef.value?.validate();

    // 检查是否选择了文件
    if (fileList.value.length === 0) {
      message.error('请选择要上传的视频文件');
      return;
    }

    loading.value = true;
    uploading.value = true;

    // 触发上传
    const uploadOptions = {
      onProgress: (progressEvent: any) => {
        uploadProgress.value = progressEvent.percent;
      },
      onSuccess: (response: any, file: any) => {
        message.success('视频上传成功！');
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          router.back();
        }, 1500);
      },
      onError: (error: any) => {
        console.error('视频上传失败:', error);
        message.error('视频上传失败，请重试');
      }
    };
    
    await customUpload(uploadOptions);

  } catch (error) {
    console.error('表单验证失败:', error);
    message.error('请检查表单信息是否正确');
  } finally {
    loading.value = false;
    uploading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.video-upload-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.upload-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.upload-card, .preview-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: border-color 0.3s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #1890ff;
}

.upload-placeholder.has-file {
  border-color: #52c41a;
  background: #f6ffed;
}

.upload-icon, .file-icon {
  margin-bottom: 16px;
}

.upload-text p {
  margin: 4px 0;
  color: #666;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.file-details {
  text-align: left;
}

.file-name {
  font-weight: 500;
  margin: 0;
  color: #333;
}

.file-size, .upload-status {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

.upload-status.uploading {
  color: #1890ff;
}

.upload-progress {
  margin-top: 16px;
  text-align: center;
}

.progress-text {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #666;
}

.preview-content {
  text-align: center;
}

.video-preview {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  background: #000;
}

.preview-placeholder {
  padding: 60px 20px;
  color: #999;
  background: #f5f5f5;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-content {
    padding: 16px;
  }
  
  .file-info {
    flex-direction: column;
    text-align: center;
  }
  
  .video-preview {
    max-height: 300px;
  }
}
</style>