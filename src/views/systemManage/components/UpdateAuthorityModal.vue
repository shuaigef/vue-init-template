<template>
  <a-modal 
    v-model:open="props.visible" 
    title="修改权限" 
    cancelText="取消" 
    okText="确认" 
    :confirmLoading="confirmLoading"
    @ok="handleOk" 
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :rules="formRules" :model="formData" layout="vertical" hideRequiredMark>
      <a-form-item name="code" label="code">
        <a-input v-model:value="formData.code" placeholder="请输入 code" />
      </a-form-item>
      <a-form-item name="name" label="权限名称">
        <a-input v-model:value="formData.name" placeholder="请输入权限名称" />
      </a-form-item>
      <a-form-item name="name" label="菜单顺序">
        <a-input-number v-model:value="formData.orderNo" :min="1" placeholder="请输入菜单顺序" />
      </a-form-item>
      <a-form-item name="parentId" label="父权限 id">
        <a-input v-model:value="formData.parentId" placeholder="请输入父权限 id" />
      </a-form-item>
      <a-form-item name="authorityType" label="权限类型">
        <a-input v-model:value="formData.authorityType" placeholder="请输入权限类型" />
      </a-form-item>
      <a-form-item name="redirect" label="一级菜单跳转路径">
        <a-input v-model:value="formData.redirect" placeholder="请输入一级菜单跳转路径" />
      </a-form-item>
      <a-form-item name="path" label="路由路径">
        <a-input v-model:value="formData.path" placeholder="请输入路由路径" />
      </a-form-item>
      <a-form-item name="hidden" label="是否隐藏菜单">
        <a-select v-model:value="formData.hidden" placeholder="请选择是否隐藏菜单">
          <a-select-option :value="0">否</a-select-option>
          <a-select-option :value="1">是</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="menuIcon" label="菜单图标">
        <a-input v-model:value="formData.menuIcon" placeholder="请输入菜单图标" />
      </a-form-item>
      <a-form-item name="component" label="组件">
        <a-input v-model:value="formData.component" placeholder="请输入组件" />
      </a-form-item>
      <a-form-item name="componentName" label="组件名称">
        <a-input v-model:value="formData.componentName" placeholder="请输入组件名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { updateAuthority } from "@/api/authority";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  updateFormData: API.AuthorityUpdateParams;
}>();

const emit = defineEmits(["ok", "update:visible"]);

const formRef = ref();
/** 表单数据 */
const formData = ref<API.AuthorityUpdateParams>({
  id: "",
  code: "",
  name: "",
  orderNo: 1,
  parentId: "0",
  authorityType: "",
  redirect: "",
  path: "",
  hidden: 0,
  menuIcon: "",
  component: "",
  componentName: "",
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
  code: [{ required: true, message: "请输入 code", trigger: "change" }],
  name: [{ required: true, message: "请输入权限名称", trigger: "change" }],
  orderNo: [{ required: true, message: "请输入菜单顺序", trigger: "change" }],
  parentId: [{ required: true, message: "请输入父节点id", trigger: "change" }],
  authorityType: [{ required: true, message: "请输入权限类型", trigger: "change" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "change" }],
  hidden: [{ required: true, message: "请输入是否隐藏路由菜单", trigger: "change" }],
  component: [{ required: true, message: "请输入组件", trigger: "change" }],
  componentName: [{ required: true, message: "请输入组件名称", trigger: "change" }],
};
/** 确认按钮加载 */
const confirmLoading = ref(false);
/** 对话框确认事件 */
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    await formRef.value.validate();
    const res = await updateAuthority(formData.value);
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
    code: "",
    name: "",
    orderNo: 1,
    parentId: "0",
    authorityType: "",
    redirect: "",
    path: "",
    hidden: 0,
    menuIcon: "",
    component: "",
    componentName: "",
  };
};
</script>

<style scoped lang="scss">

</style>
