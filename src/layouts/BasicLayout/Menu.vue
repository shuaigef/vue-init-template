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
import { ref } from "vue";
import { useRouter } from "vue-router";

const selectedKeys = ref<string[]>(["home"]);
const router = useRouter();
const toPage = ({ key }: { key: string }) => {
	selectedKeys.value[0] = key;
	router.push({
		name: key,
	});
};
toPage({ key: selectedKeys.value[0] });
</script>

<style scoped lang="scss">

</style>
