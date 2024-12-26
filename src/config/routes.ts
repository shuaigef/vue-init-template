import * as VueRouter from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import LoginLayout from "../layouts/LoginLayout.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import dynamicRoutes from "./dynamicRoutes";

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

export default router;
