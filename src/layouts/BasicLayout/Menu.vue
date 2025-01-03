<template>
  <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline" @click="toPage">
    <a-menu-item key="home">
      <user-outlined />
      <span>首页</span>
    </a-menu-item>
    <a-menu-item key="accountSetting">
      <user-outlined />
      <span>个人中心</span>
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const selectedKeys = ref<string[]>(["home"]);
const router = useRouter();
const toPage = ({ key }: { key: string }) => {
	selectedKeys.value[0] = key;
	router.push({
		name: key,
	});
};
toPage({ key: selectedKeys.value[0] });

const route = useRoute();
// 监听路由变化来动态更新选中的菜单项
watch(() => route.name, (newValue) => {
  selectedKeys.value[0] = String(newValue);
});
</script>

<style scoped lang="scss">

</style>
