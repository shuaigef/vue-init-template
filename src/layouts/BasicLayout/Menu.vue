<template>
	<a-config-provider
			:theme="{
				'components': {
					'Menu': {
						'colorActiveBarBorderSize': 0
					}
				}
			}" 
	>
		<a-menu 
				class="menu-main" 
				theme="light" 
				v-model:selectedKeys="selectedKeys" 
				mode="inline" 
				@click="toPage"
		>
			<a-menu-item key="home">
				<user-outlined />
				<span>首页</span>
			</a-menu-item>
			<a-menu-item key="accountSetting">
				<user-outlined />
				<span>个人设置</span>
			</a-menu-item>
			<a-sub-menu key="systemManage">
				<template #title>
					<user-outlined />
					<span>系统管理</span>
				</template>
				<a-menu-item key="userManage">用户管理</a-menu-item>
				<a-menu-item key="authorityManage">权限管理</a-menu-item>
			</a-sub-menu>
		</a-menu>
	</a-config-provider>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const selectedKeys = ref<string[]>(["home"]);
const router = useRouter();
const toPage = ({ key }: { key: string }) => {
	router.push({
		name: key,
	});
};
// toPage({ key: selectedKeys.value[0] });

const route = useRoute();
// 监听路由变化来动态更新选中的菜单项
watch(
	() => route.matched,
	(matchedRoutes) => {
		const temp: string[] = [];
		for (const item of matchedRoutes) {
			if (item.name) {
				temp.push(item.name as string);
			}
		}
		selectedKeys.value = temp;
	},
	{ immediate: true },
);
</script>

<style scoped lang="scss">
.menu-main {
	background: transparent;  
}
</style>
