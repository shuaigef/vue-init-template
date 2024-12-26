<template>
  <div class="login">
    <div class="main">
      <div class="top">
        <div class="title">前端初始化模版</div>
      </div>
      <a-form :model="userLoginParams" name="normal_login" class="login-form" @submit="onSubmit">
        <a-form-item name="username">
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
          <a-button type="primary" html-type="submit" block size="large">登录</a-button>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const userLoginParams = ref({
	usernameOrEmail: "",
	password: "",
});

const onSubmit = async () => {
	message.success("登录成功");
	router.push("/index");
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
