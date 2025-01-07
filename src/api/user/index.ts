import http from "../../plugins/request";

export async function updateUserBasicInfo(body: API.UserUpdateBasicInfoParams) {
	return http.request<API.LoginUser>({
		url: "/manage/user/basic",
		method: "PUT",
		data: body
	});
}
