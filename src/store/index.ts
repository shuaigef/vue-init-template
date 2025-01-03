import { defineStore } from "pinia";
import { ref } from "vue";
import { LocalStorageEnum } from "../constants";

export const useIndexStore = defineStore("index", () => {
	const str = "hello world";

	return {
		str,
	};
});

export const useSystemStore = defineStore("system", () => {
	const loginUserStr = ref(localStorage.getItem(LocalStorageEnum.LOGIN_USER));
	const loginUser = ref<API.LoginUser | null>(
		loginUserStr.value ? JSON.parse(loginUserStr.value) : null,
	);

	return {
		loginUser,
	};
});
