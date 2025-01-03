declare namespace API {
	type UserLoginParams = {
		usernameOrEmail: string;
		password: string;
	};

	type SessionUser = {
		userId: string;
		roleId: string;
		nickname: string;
		userAvatar?: string;
		gender: number;
		username: string;
	};

	type LoginUser = {
		token: string;
		userInfo: API.SessionUser;
		authorityList: API.Authority[];
	};
}
