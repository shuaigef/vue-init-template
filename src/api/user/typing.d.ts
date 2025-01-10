declare namespace API {
	type UserUpdateBasicInfoParams = {
		username: string;
		nickname: string;
		userAvatar?: string;
		gender: number;
		userProfile?: string;
	};

	type UserQueryParams = {
		username?: string;
		nickname?: string;
	} & API.PageRequest;

	type User = {
		id: string;
		username: string;
		nickname: string;
		userAvatar?: string;
		userProfile?: string;
		gender: number;
		email?: string;
		phoneNumber?: string;
		roleId: string;
		roleName: string;
		createTime: string;
	};

	type UserAddParams = {
		username: string;
		password: string;
		nickname: string;
		userAvatar?: string;
		gender: number;
		roleId: string,
		email?: string;
		phoneNumber?: string;
	};

	type UserUpdateParams = {
		id: string;
		username: string;
		nickname: string;
		userAvatar?: string;
		userProfile?: string;
		gender: number;
		email?: string;
		phoneNumber?: string;
		roleId: string;
	}
}
