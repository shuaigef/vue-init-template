import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "../layouts/BasicLayout/Index.vue";
import Index from "../views/Index.vue";
import AccountSetting from "../views/AccountSetting.vue";

const dynamicRoutes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "basicLayout",
		component: BasicLayout,
		children: [
			{ path: "home", name: "home", component: Index, meta: { title: "首页" } },
			{ path: "accountSetting", name: "accountSetting", component: AccountSetting, meta: { title: "个人中心" } },
		],
	},
];

export default dynamicRoutes;
