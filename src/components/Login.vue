<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const handleRegister = () => {
  console.log('注册：', username.value, password.value);
  // 执行注册操作
};
</script>
<template>
  <div class="Login-container">
    <h2>登录页面</h2>
    <form>
      <a-input v-model="username" placeholder="用户名" />
      <a-input v-model="password" placeholder="密码" type="password" />
      <a-button type="primary" @click="handleRegister">登录</a-button>
    </form>
  </div>
</template>
<style scoped>

.Login-container {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.a-input, .a-button {
  width: 100%;
}
</style>
