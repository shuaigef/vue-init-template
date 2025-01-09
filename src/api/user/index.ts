import http from "../../plugins/request";

export async function updateUserBasicInfo(body: API.UserUpdateBasicInfoParams) {
	return http.request<API.LoginUser>({
		url: "/manage/user/basic",
		method: "PUT",
		data: body,
	});
}

export async function listUserByPage(data: API.UserQueryParams) {
	return http.request<API.Page<API.User>>({
		url: "/manage/user/list/page",
		method: "GET",
		params: {
			...data
		},
	});
}

export async function deleteUser(id: string) {
	return http.request<boolean>({
			url: "/manage/user",
			method: "DELETE",
			data: {
					id
			}
	})
}

export async function deleteBatchUser(ids: string[]) {
	return http.request<boolean>({
			url: "/manage/user/ids",
			method: "DELETE",
			data: {
					ids
			}
	})
}

export async function addUser(data: API.UserAddParams) {
	return http.request<string>({
			url: "/manage/user",
			method: "POST",
			data: data
	})
}
