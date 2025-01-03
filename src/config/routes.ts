import { message } from "ant-design-vue";
import * as VueRouter from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { LocalStorageEnum } from "../constants";
import LoginLayout from "../layouts/LoginLayout.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import dynamicRoutes from "./dynamicRoutes";

const routeWhiteList = ["login", "register"];

const baseRoutes: RouteRecordRaw[] = [
	{
		path: "/index",
		redirect: "/home",
	},
	{
		path: "/user",
		name: "loginLayout",
		component: LoginLayout,
		children: [
			{ path: "login", name: "login", component: Login },
			{ path: "register", name: "register", component: Register },
		],
	},
];

// 可以根据需要将 dynamicRoutes 改为从后端动态获取
const router = VueRouter.createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: VueRouter.createWebHashHistory(),
	routes: baseRoutes.concat(dynamicRoutes), // `routes: routes` 的缩写
});

// 路由守卫：在每次路由跳转前检查登录状态
router.beforeEach((to, from, next) => {
	const jwt = localStorage.getItem(LocalStorageEnum.JWT);

	if (!routeWhiteList.includes(to.name as string) && !jwt) {
		// 如果路由不是登录页并且没有登录信息，则跳转到登录页
		message.error("请先登录");
		next({ name: "login" });
	} else {
		// 如果已登录，或者跳转目标是登录页，正常跳转
		next();
	}
});

export default router;
