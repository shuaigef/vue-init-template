<template>
  <div class="login">
    <div class="main">
      <div class="top">
        <div class="title">前端初始化模版</div>
      </div>
      <a-form :model="userLoginParams" name="login" class="login-form" @finish="handleLogin" :rules="userLoginRules">
        <a-form-item name="usernameOrEmail">
          <a-input v-model:value="userLoginParams.usernameOrEmail" placeholder="账号" size="large">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password v-model:value="userLoginParams.password" placeholder="密码" size="large">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-row justify="space-between" style="width: 100%">
            <a-col span="12">
              <a-checkbox>自动登录</a-checkbox>
            </a-col>
            <a-col span="12" style="text-align: right;">
              <a-button type="link">忘记密码</a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block size="large" :loading="loading">登录</a-button>
        </a-form-item>

        <a-form-item >
          <a-button type="text" block size="large" @click="toRegister" style="color: #86909c">注册</a-button>
        </a-form-item>

      </a-form>
    </div>
  </div>

</template>

<script setup lang="ts">
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/system/index";
import { LocalStorageEnum } from "../constants";
import { useSystemStore } from "../store/index";

const systemStore = useSystemStore();
const { loginUser } = storeToRefs(systemStore);

const router = useRouter();

const loading = ref(false);

const userLoginRules: Record<string, Rule[]> = {
  usernameOrEmail: [
    {
      required: true,
      message: "请输入用户名或邮箱",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
};

const userLoginParams = ref<API.UserLoginParams>({
  usernameOrEmail: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await login(userLoginParams.value);
    if (res.code === 0) {
      localStorage.setItem(LocalStorageEnum.JWT, `Bearer ${res.data.token}`);
      localStorage.setItem(LocalStorageEnum.LOGIN_USER, JSON.stringify(res.data));
      loginUser.value = res.data;
      message.success("登录成功");
      router.push("/index");
    } else {
      message.error(res.message);
    }
  } finally {
    loading.value = false;
  }
};

const toRegister = () => {
  router.push({
    name: "register",
  });
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .main {
    width: 368px;
    .top{
      .title {
        color: #1d2129;
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
      }
    }
    .login-form {
      margin-top: 32px
    }
  }
}

</style>
