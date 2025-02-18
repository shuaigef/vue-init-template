<template>
  <a-modal 
    v-model:open="props.visible" 
    title="修改用户" 
    cancelText="取消" 
    okText="确认" 
    :confirmLoading="confirmLoading"
    @ok="handleOk" 
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :rules="formRules" :model="formData" layout="vertical" hideRequiredMark>
      <a-form-item name="userAvatar" label="头像">
        <SingleImageUpload :biz="FileUploadBizEnum.USER_AVATAR" v-model:fileUrl="formData.userAvatar"/>
      </a-form-item>
      <a-form-item name="username" label="用户名">
        <a-input v-model:value="formData.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item name="nickname" label="昵称">
        <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item name="userProfile" label="个人简介">
        <a-textarea v-model:value="formData.userProfile" :maxlength="50" showCount rows="4" placeholder="请输入个人简介"/>
      </a-form-item>
      <a-form-item name="gender" label="性别">
        <a-select v-model:value="formData.gender" placeholder="请选择性别">
          <a-select-option :value="0">未知</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="roleId" label="角色">
        <a-select v-model:value="formData.roleId" placeholder="请选择角色">
          <a-select-option v-for="(role) in roleList" :key="role.id" :value="role.id">{{ role.roleName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="email" label="邮箱">
        <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item name="phoneNumber" label="手机号">
        <a-input v-model:value="formData.phoneNumber" placeholder="请输入手机号" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { listRole } from "@/api/role";
import { updateUser } from "@/api/user";
import { FileUploadBizEnum } from "@/constants";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { ref, watch } from "vue";
import SingleImageUpload from "../../../components/SingleImageUpload.vue";

const props = defineProps<{
  visible: boolean;
  updateFormData: API.UserUpdateParams;
}>();

const emit = defineEmits(["ok", "update:visible"]);

const formRef = ref();
/** 表单数据 */
const formData = ref<API.UserUpdateParams>({
  id: "",
  username: "",
  userProfile: "",
  nickname: "",
  userAvatar: "",
  gender: 0,
  roleId: "",
  email: "",
  phoneNumber: "",
});
watch(
  () => props.updateFormData,
  (newValue) => {
    formData.value = {
      ...newValue,
    };
  },
);
/** 表单校验规则 */
const formRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: "请输入用户名", trigger: "change" },
    {
      pattern: /^[a-zA-Z0-9_-]{4,10}$/,
      message: "请输入有效的用户名（4-10位，字母、数字、下划线或横线）",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "change" },
    {
      pattern: /^[\w!@#$%^&*()+-=.]{6,18}$/,
      message: "请输入有效的密码（6-18位，字母、数字、下划线或特殊字符）",
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
/** 确认按钮加载 */
const confirmLoading = ref(false);
/** 对话框确认事件 */
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    await formRef.value.validate();
    const res = await updateUser(formData.value);
    if (res.code === 0) {
      handleCancel();
      message.success(res.message);
      emit("ok");
    } else {
      message.error(res.message);
    }
  } finally {
    confirmLoading.value = false;
  }
};
/** 对话框取消事件 */
const handleCancel = () => {
  emit("update:visible", false);
  formData.value = {
    id: "",
    username: "",
    userProfile: "",
    nickname: "",
    userAvatar: "",
    gender: 0,
    roleId: "",
    email: "",
    phoneNumber: "",
  };
};
/** 角色列表 */
const roleList = ref<API.Role[]>([]);
/** 获取角色数据 */
(async () => {
  const res = await listRole();
  if (res.code === 0) {
    roleList.value = res.data;
  } else {
    message.error(res.message);
  }
})();
</script>

<style scoped lang="scss">

</style>
