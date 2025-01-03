<template>
  <div class="register">
    <div class="main">
      <div class="top">
        <div class="title">前端初始化模版</div>
      </div>
      <a-form class="register-form" :rules="userRegisterFormRules" :model="userRegisterParams" layout="vertical" @finish="handleRegister">
        <a-form-item name="username" label="用户名">
          <a-input v-model:value="userRegisterParams.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="email" label="邮箱">
          <a-input v-model:value="userRegisterParams.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item name="password" label="密码">
          <a-input-password
              v-model:value="userRegisterParams.password"
              placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item name="checkPassword" label="确认密码">
          <a-input-password
          v-model:value="userRegisterParams.checkPassword"
              placeholder="请输入确认密码"
          />
        </a-form-item>
        <a-form-item name="verificationCode" label="验证码">
          <div style="display: flex">
            <a-input v-model:value="userRegisterParams.verificationCode" placeholder="请输入验证码" />
            <a-button style="margin-left: 10px" type="primary" :loading="sendButtonLoading" :disabled="!userRegisterParams.email || isActive" @click="handleSend">{{ isActive? `请${time} 秒后重新获取` : '点击发送验证码' }}</a-button>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="registerButtonLoading" size="large">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { register, sendVerificationCode } from "../api/system";
import { VerificationCodeBizEnum } from "../constants";

// region 倒计时
const time = ref(0);
const { pause, resume, isActive } = useIntervalFn(() => {
	/* your function */
	time.value--;
	if (time.value <= 0) {
		pause();
	}
}, 1000);
onMounted(() => {
	pause();
});

const sendButtonLoading = ref(false);

const handleSend = async () => {
	sendButtonLoading.value = true;
	try {
		const res = await sendVerificationCode(
			userRegisterParams.value.email,
			VerificationCodeBizEnum.EMAIL_REGISTER,
		);
		if (res.code === 0) {
			time.value = 60;
			resume();
			message.success("验证码发送成功");
		} else {
			message.error(res.message);
		}
	} finally {
		sendButtonLoading.value = false;
	}
};
// endregion

const userRegisterFormRules: Record<string, Rule[]> = {
	username: [
		{ required: true, message: "请输入用户名", trigger: "change" },
		{
			pattern: /^[a-zA-Z0-9_-]{4,10}$/,
			message: "请输入有效的用户名（4-10位，字母、数字、下划线或横线）",
			trigger: "blur",
		},
	],
	email: [
		{ required: true, message: "请输入邮箱", trigger: "change" },
		{ type: "email", message: "请输入有效的邮箱", trigger: "blur" },
	],
	password: [
		{ required: true, message: "请输入密码", trigger: "change" },
		{
			pattern: /^[\w!@#$%^&*()+-=.]{6,18}$/,
			message: "请输入有效的密码（6-18位，字母、数字、下划线或特殊字符）",
			trigger: "blur",
		},
	],
	checkPassword: [
		{ required: true, message: "请再次输入密码", trigger: "change" },
		{
			// 自定义验证规则，检查两次输入的密码是否相同
			validator: (rule, value) => {
				return new Promise((resolve, reject) => {
					if (value && value !== userRegisterParams.value.password) {
						reject("两次输入的密码不一致");
					} else {
						resolve();
					}
				});
			},
			trigger: "blur",
		},
	],
	verificationCode: [
		{ required: true, message: "请输入验证码", trigger: "change" },
	],
};

const userRegisterParams = ref<API.UserRegisterParams>({
	username: "",
	email: "",
	password: "",
	checkPassword: "",
	verificationCode: "",
});

const router = useRouter();

const registerButtonLoading = ref(false);

const handleRegister = async () => {
	registerButtonLoading.value = true;
	try {
		const res = await register(userRegisterParams.value);
		if (res.code === 0) {
			message.success("注册成功");
			router.push({
				name: "login",
			});
		} else {
			message.error(res.message);
		}
	} finally {
		registerButtonLoading.value = false;
	}
};
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
