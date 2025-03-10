import router from "@/config/routes";
import { LocalStorageEnum } from "@/constants";
import { useSystemStore } from "@/store";
import { message } from "ant-design-vue";
import axios, { type AxiosRequestConfig } from "axios";
import { storeToRefs } from "pinia";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const jwt = localStorage.getItem(LocalStorageEnum.JWT);
    config.headers.Authorization = jwt;
    console.log("request info", config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log("error request info", error);
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    console.log("response info", response);
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log("error response info", error);
    if (axios.isAxiosError(error)) {
      message.error(error.response?.data?.message || "系统错误");

      const status = error.response?.status;
      if (status === 403) {
        message.error("请重新登录");
        // 清除保存的登录信息
        localStorage.removeItem(LocalStorageEnum.JWT);
        localStorage.removeItem(LocalStorageEnum.LOGIN_USER);
        const systemStore = useSystemStore();
        const { loginUser } = storeToRefs(systemStore);
        loginUser.value = null;
        // 跳转到登录
        router.push({ name: "login" });
      }
    } else {
      message.error("系统错误");
    }

    return Promise.reject(error);
  },
);

const http = {
  request<T>(config: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
    return instance.request(config);
  },
  get<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
    return instance.get(url, { params, ...config });
  },
  post<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
    return instance.post(url, data, config);
  },
  put<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
    return instance.put(url, data, config);
  },
  delete<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<API.BaseResponse<T>> {
    return instance.delete(url, { data, ...config });
  },
};

export default http;
