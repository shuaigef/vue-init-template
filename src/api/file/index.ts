import type { AxiosProgressEvent } from "axios";
import http from "../../plugins/request";

export async function uploadFile(
	biz: string,
	file: File,
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("biz", biz);

	return http.request<string>({
		url: "/file/upload",
		method: "POST",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data; charset=UTF-8",
		},
		onUploadProgress,
	});
}
