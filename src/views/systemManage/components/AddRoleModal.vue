<template>
  <a-modal 
    v-model:open="props.visible" 
    title="新增角色" 
    cancelText="取消" 
    okText="确认" 
    :confirmLoading="confirmLoading"
    @ok="handleOk" 
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :rules="formRules" :model="formData" layout="vertical" hideRequiredMark>
			<a-form-item name="roleName" label="角色名">
        <a-input v-model:value="formData.roleName" placeholder="请输入角色名" />
      </a-form-item>
      <a-form-item name="roleDesc" label="角色描述">
        <a-input v-model:value="formData.roleDesc" placeholder="请输入角色描述" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { ref } from "vue";
import { addRole } from "../../../api/role";

const props = defineProps<{
	visible: boolean;
}>();

const emit = defineEmits(["ok", "update:visible"]);

const formRef = ref();
/** 表单数据 */
const formData = ref<API.RoleAddParams>({
	roleName: "",
	roleDesc: "",
});
/** 表单校验规则 */
const formRules: Record<string, Rule[]> = {
	roleName: [{ required: true, message: "请输入角色名", trigger: "change" }],
	roleDesc: [{ required: true, message: "请输入角色描述", trigger: "change" }],
};
/** 确认按钮加载 */
const confirmLoading = ref(false);
/** 对话框确认事件 */
const handleOk = async () => {
	confirmLoading.value = true;
	try {
		await formRef.value.validate();
		const res = await addRole(formData.value);
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
		roleName: "",
		roleDesc: "",
	};
};
</script>

<style scoped lang="scss">

</style>
