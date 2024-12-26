import axios, { type AxiosRequestConfig } from "axios";
import router from "../config/routes";
import { LocalStorageEnum } from "../constants";

const instance = axios.create({
	baseURL: "http://localhost:8080/api/",
	timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么
		const jwt = localStorage.getItem(LocalStorageEnum.JWT);
		config.headers.set("Authorization", jwt);
		console.log("request", config);
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	},
);

// 添加响应拦截器
instance.interceptors.response.use(
	(response) => {
		// 2xx 范围内的状态码都会触发该函数。
		// 对响应数据做点什么
		console.log(response);
		return response.data;
	},
	(error) => {
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		console.log(error.status, error);

		if (error.response.status === 403) {
			router.push({
				name: "login",
			});
			localStorage.removeItem(LocalStorageEnum.JWT);
			localStorage.removeItem(LocalStorageEnum.LOGIN_USER);
		}
		return Promise.reject(error);
	},
);

const http = {
	request<T>(config: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
		return instance.request(config);
	},
	get<T>(
		url: string,
		params?: object,
		config?: AxiosRequestConfig,
	): Promise<API.BaseResponse<T>> {
		return instance.get(url, { params, ...config });
	},
	post<T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig,
	): Promise<API.BaseResponse<T>> {
		return instance.post(url, data, config);
	},
	put<T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig,
	): Promise<API.BaseResponse<T>> {
		return instance.put(url, data, config);
	},
	delete<T>(
		url: string,
		data?: object,
		config?: AxiosRequestConfig,
	): Promise<API.BaseResponse<T>> {
		return instance.delete(url, { data, ...config });
	},
};

export default http;
