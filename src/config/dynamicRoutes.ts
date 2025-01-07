import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "../layouts/BasicLayout/Index.vue";
import Index from "../views/Index.vue";
import BasicSettings from "../views/accountSetting/BasicSettings.vue";
import AccountSettings from "../views/accountSetting/Index.vue";

const dynamicRoutes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "basicLayout",
		component: BasicLayout,
		children: [
			{
				path: "home",
				name: "home",
				component: Index,
				meta: { title: "首页" },
			},
			{
				path: "account/setting",
				name: "accountSetting",
				component: AccountSettings,
				redirect: "/account/setting/basic",
				meta: { title: "个人设置" },
				children: [
					{
						path: "basic",
						name: "basicSettings",
						component: BasicSettings,
						meta: { title: "基本设置" },
					},
				],
			},
		],
	},
];

export default dynamicRoutes;
