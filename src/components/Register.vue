<script setup lang="ts">
import {reactive, ref} from 'vue'
import { api } from '../auth'
import router from "../router";

const userData =reactive({
  account: '',
  password: '',
  checkPassword: ''
})

const loading = ref(false);

const handleRegister = async () => {
  if (userData.account.length < 6 || userData.account.length > 20) {
    alert('用户名长度需在 6~20 位之间');
    console.log(userData)
    return;
  }
  if (userData.password.length < 6 || userData.password.length > 20) {
    alert('密码长度需在 6~20 位之间');
    return;
  }
  if (userData.password !== userData.checkPassword) {
    alert('两次输入的密码不一致');
    return;
  }
  loading.value=true;
  try {
      await api.post('/user/register', {
        account: userData.account,
        password: userData.password,
        checkPassword: userData.checkPassword
      });
      alert('注册成功');
      setTimeout(()=>{
         router.push('/login')
      },1000)
  } catch (error) {
      alert('注册失败,请重试');
  }finally{
    loading.value = false;
  }
};
</script>

<template>
  <h2>注册页面</h2>
  <div class="register-container">
    <form>
      <a-input v-model:value="userData.account" placeholder="账号" />
      <a-input v-model:value="userData.password" placeholder="密码" type="password" />
      <a-input v-model:value="userData.checkPassword" placeholder="确认密码" type="password" />
      <a-button type="primary" :loading="loading" @click="handleRegister">注册</a-button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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
</style>