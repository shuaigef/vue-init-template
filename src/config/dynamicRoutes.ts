import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "../layouts/BasicLayout/Index.vue";
import Index from "../views/Index.vue";
import BasicSetting from "../views/accountSetting/BasicSetting.vue";
import AccountSetting from "../views/accountSetting/Index.vue";

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
				component: AccountSetting,
				redirect: "/account/setting/basic",
				meta: { title: "个人设置" },
				children: [
					{
						path: "basic",
						name: "basicSetting",
						component: BasicSetting,
						meta: { title: "基本设置" },
					},
				],
			},
		],
	},
];

export default dynamicRoutes;
