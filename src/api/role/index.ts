import http from "../../plugins/request";

export async function listRole() {
	return http.request<API.Role[]>({
		url: "/manage/role/list",
		method: "GET",
	});
}
