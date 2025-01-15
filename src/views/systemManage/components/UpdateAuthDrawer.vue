<template>
  <a-drawer 
    :width="340" 
    title="所拥有的权限" 
    v-model:visible="props.visible" 
    @close="onClose" 
    :footer-style="{ textAlign: 'right' }"
  >
    <a-tree
      blockNode
      checkable
      defaultExpandAll
      :fieldNames="{
        key: 'id',
        title: 'name',
        children: 'children'
      }"
      v-model:checkedKeys="checkedKeys"
      :treeData="treeData"
      @check="onCheck"
    />
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="onConfirm">确认</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import type { AntTreeNodeCheckedEvent } from "ant-design-vue/es/tree";
import { computed, defineEmits, defineProps, ref, watch } from "vue";
import { roleBindAuthority } from "../../../api/authority";

const props = defineProps<{
  visible: boolean;
  authRoleId: string;
  authTreeData: API.Authority[];
}>();

const emit = defineEmits(["update:visible"]);

const treeData = ref<API.Authority[]>([]);

const checkedKeys = ref<{
  checked: string[];
  halfChecked: string[];
}>({
  checked: [],
  halfChecked: [],
});

const authorityUpdateParams = computed<API.RoleAuthorityUpdateParams>(() => ({
  roleId: props.authRoleId,
  authorityIds: checkedKeys.value.checked.concat(checkedKeys.value.halfChecked),
}));
const confirmLoading = ref(false);
const onConfirm = async () => {
  confirmLoading.value = true;
  try {
    const res = await roleBindAuthority(authorityUpdateParams.value);
    if (res.code === 0) {
      // 子组件触发父组件事件
      emit("update:visible", false);
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  } finally {
    confirmLoading.value = false;
  }
};

const onClose = () => {
  emit("update:visible", false);
};

const initCheckedAndHalfCheckedKeys = (tree: API.Authority[]) => {
  const checked: string[] = [];
  const halfChecked: string[] = [];

  const traverse = (nodes: API.Authority[]): { isAllChecked: boolean; isSomeChecked: boolean } => {
    let isAllChecked = true;
    let isSomeChecked = false;

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const { isAllChecked: childAll, isSomeChecked: childSome } = traverse(node.children);

        if (childAll) {
          checked.push(node.id); // 子节点全选中，父节点完全选中
        } else if (childSome) {
          halfChecked.push(node.id); // 子节点部分选中，父节点半选
        }
        isAllChecked = isAllChecked && childAll;
        isSomeChecked = isSomeChecked || childSome;
      } else {
        if (node.check) {
          checked.push(node.id); // 叶子节点选中
        } else {
          isAllChecked = false; // 如果有一个未选中，父节点不能是全选
        }
        isSomeChecked = isSomeChecked || !!node.check;
      }
    }

    return { isAllChecked, isSomeChecked };
  };

  traverse(tree);
  checkedKeys.value.checked = checked;
  checkedKeys.value.halfChecked = halfChecked;
};

watch(
  () => props.authTreeData,
  async (newValue) => {
    treeData.value = newValue;
    console.log({ authTreeData: props.authTreeData });
    initCheckedAndHalfCheckedKeys(newValue);
  },
);

const onCheck = (checked: string[], e: AntTreeNodeCheckedEvent & { halfCheckedKeys: string[] }) => {
  checkedKeys.value.checked = checked;
  checkedKeys.value.halfChecked = e.halfCheckedKeys;
};
</script>

<style scoped>

</style>
