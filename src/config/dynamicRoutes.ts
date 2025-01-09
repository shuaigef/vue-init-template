import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "../layouts/BasicLayout/Index.vue";
import Index from "../views/Index.vue";
import BasicSetting from "../views/accountSetting/BasicSetting.vue";
import AccountSetting from "../views/accountSetting/Index.vue";
import UserManage from "../views/systemManage/UserManage.vue";

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
			// {
			// 	path: "system/manage/user",
			// 	name: "userManage",
			// 	component: UserManage,
			// 	meta: { title: "用户管理" },
			// },
			{
				path: "system/manage",
				name: "systemManage",
				redirect: "/system/manage/user",
				meta: { title: "系统管理" },
				children: [
					{
						path: "user",
						name: "userManage",
						component: UserManage,
						meta: { title: "用户管理" },
					},
				],
			},
		],
	},
];

export default dynamicRoutes;
