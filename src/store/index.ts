import { defineStore } from "pinia";

export const useIndexStore = defineStore("index", () => {
	const str = "hello world";

	return {
		str,
	};
});
