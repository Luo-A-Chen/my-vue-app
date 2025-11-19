<template>
  <div class="edit-profile-container">
    <a-page-header title="编辑个人信息" @back="goBack" style="margin-bottom: 20px;"/>
    <a-card title="基本信息" style="max-width: 600px; margin: 0 auto;">
      <a-form :model="user" layout="vertical">
        <a-form-item label="头像">
          <div style="display:flex; align-items: center; gap:16px;">
            <a-avatar :src="user.avatar" style="margin-right: 10px;"/>
            {{ user.name?.charAt(0)||'User'}}
            <a-upload
                name="avatar"
                :show-upload-list="false"
                :custom-request="handleAvatarUpload"
                accept="image/*"
            >
              <a-button>
                <a-icon type="upload" />
                上传头像
              </a-button>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="用户名" required>
          <a-input
              v-model:value="user.name"
              placeholder="请输入用户名"
              :maxlength="20"
          />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
              v-model:value="user.email"
              placeholder="请输入邮箱"
              type="email"
          />
        </a-form-item>
        <a-form-item label="个人简介">
          <a-textarea
              v-model:value="user.profile"
              placeholder="请输入个人简介"
              :rows="4"
              :maxlength="200"
              show-count
          />
        </a-form-item>
        <a-form-item>
          <div style="display: flex; gap: 12px;">
            <a-button type="primary" @click="handleSubmit">
              保存修改
            </a-button>
            <a-button @click="goBack">
              取消
            </a-button>
          </div>
        </a-form-item>
      </a-form>

    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store';
import {message} from "ant-design-vue";
import {reactive,onMounted} from "vue";
import router from '../router';
import {api} from "../auth.ts";

const userStore = useUserStore();
const user=reactive({
    id:'',
    name:'',
    avatar:'',
    email:'',
    profile:'',
});
onMounted(async ()=>{
  try {
    const response = await api.get('/user/getUser');
    Object.assign(user, response.data);
  } catch (err: any) {
    message.error(err.message);
  }
})
// 处理头像上传
const handleAvatarUpload = (info: any) => {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.status === 'done') {
    // 假设后端返回图片URL
    user.avatar = info.file.response?.url || info.file.response?.data?.url;
    message.success('头像上传成功');
  } else if (info.file.status === 'error') {
    message.error('头像上传失败');
  }
};
//提交
const handleSubmit = async () => {
  try {
    const response=await api.post('/user/updateUser', user);
    message.success('个人信息更新成功');
    if(response.data){
      userStore.setUserInfo(response.data);
      Object.assign(user, response.data);
    }
    router.push('/');
  } catch (err) {
    message.error('个人信息更新失败');
  }
}
const goBack = () => {
  router.push('/');
};
//todo 编辑用户信息
</script>


<style scoped>
.edit-profile-container{
  padding: 20px;
}
:deep(.ant-card) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>