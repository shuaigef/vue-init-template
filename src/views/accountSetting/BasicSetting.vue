<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form :model="userBasicInfoUpdateParams" :rules="userUpdateFormRules" hideRequiredMark layout="vertical" @finish="handleUpdate">
          <a-form-item name="userAvatar" label="头像">
            <SingleImageUpload :biz="FileUploadBizEnum.USER_AVATAR" v-model:fileUrl="userBasicInfoUpdateParams.userAvatar"/>
          </a-form-item>
          <a-form-item name="username" label="用户名">
            <a-input v-model:value="userBasicInfoUpdateParams.username" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item name="nickname" label="昵称">
            <a-input v-model:value="userBasicInfoUpdateParams.nickname" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item name="gender" label="性别">
            <a-select v-model:value="userBasicInfoUpdateParams.gender" placeholder="请选择性别">
              <a-select-option :value="0">未知</a-select-option>
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="userProfile" label="个人简介">
            <a-textarea v-model:value="userBasicInfoUpdateParams.userProfile" :maxlength="50" showCount rows="4" placeholder="请输入个人简介"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="updateButtonLoading">更新基本信息</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { updateUserBasicInfo } from "@/api/user";
import { FileUploadBizEnum, LocalStorageEnum } from "@/constants";
import { useSystemStore } from "@/store";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const systemStore = useSystemStore();
const { loginUser } = storeToRefs(systemStore);

const userUpdateFormRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: "请输入用户名", trigger: "change" },
    {
      pattern: /^[a-zA-Z0-9_-]{4,10}$/,
      message: "请输入有效的用户名（4-10位，字母、数字、下划线或横线）",
      trigger: "blur",
    },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "change" },
    {
      min: 2,
      max: 10,
      message: "请输入有效的昵称（2-10位字符）",
      trigger: "blur",
    },
  ],
};

const userBasicInfoUpdateParams = ref<API.UserUpdateBasicInfoParams>({
  username: loginUser.value?.userInfo.username || "",
  nickname: loginUser.value?.userInfo.nickname || "",
  gender: loginUser.value?.userInfo.gender || 0,
  userProfile: loginUser.value?.userInfo.userProfile || "",
  userAvatar: loginUser.value?.userInfo.userAvatar || "",
});

const updateButtonLoading = ref(false);

const handleUpdate = async () => {
  updateButtonLoading.value = true;
  try {
    const res = await updateUserBasicInfo(userBasicInfoUpdateParams.value);
    if (res.code === 0) {
      localStorage.setItem(LocalStorageEnum.JWT, `Bearer ${res.data.token}`);
      const newLoginUser: API.LoginUser = {
        token: res.data.token,
        userInfo: res.data.userInfo,
        authorityList: loginUser.value?.authorityList as API.Authority[],
      };
      localStorage.setItem(LocalStorageEnum.LOGIN_USER, JSON.stringify(newLoginUser));
      loginUser.value = newLoginUser;
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  } finally {
    updateButtonLoading.value = false;
  }
};
</script>

<style scoped lang="scss">

</style>
