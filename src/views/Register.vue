<template>
  <div class="register">
    <div class="main">
      <div class="top">
        <div class="title">前端初始化模版</div>
      </div>
      <a-form class="register-form" :model="formData" layout="vertical" @submit="onSubmit">
        <a-form-item name="username" label="用户名">
          <a-input v-model="formData.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input v-model="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item name="password" label="密码">
          <a-input-password
              v-model="formData.password"
              placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item name="checkPassword" label="确认密码">
          <a-input-password
              v-model="formData.checkPassword"
              placeholder="请输入确认密码"
          />
        </a-form-item>
        <a-form-item name="verificationCode" label="验证码">
          <div style="display: flex">
            <a-input v-model="formData.verificationCode" placeholder="请输入验证码" />
            <a-button style="margin-left: 10px" type="primary" :disabled="isActive" @click="handleSend">{{ isActive? `请${time} 秒后重新获取` : '点击发送验证码' }}</a-button>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block size="large">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useIntervalFn} from '@vueuse/core'
import {message} from "ant-design-vue";
import { useRouter } from "vue-router";

// region 倒计时
const time = ref(0)
const { pause, resume, isActive } = useIntervalFn(() => {
  /* your function */
  time.value--
  if (time.value <= 0) {
    pause()
  }
}, 1000)
onMounted(() => {
  pause()
})
const handleSend = async () => {
  time.value = 60
  resume()
  message.success("验证码发送成功")
}
// endregion

const formData = ref({
  username: "",
  email: "",
  password: "",
  checkPassword: "",
  verificationCode: ""
})

const router = useRouter()
const onSubmit = async () => {
  message.success("注册成功")
  router.push({
    name: "login"
  })
}

</script>

<style scoped lang="scss">
.register {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .main {
    width: 368px;
    .top {
      .title {
        color: #1d2129;
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
    }
    .register-form {
      margin-top: 32px
    }
  }
}

</style>
