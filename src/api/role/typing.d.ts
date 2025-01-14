declare namespace API {
	type Role = {
		id: string;
		roleName: string;
		roleDesc: string;
		createTime: string;
	};

	type RoleAddParams = {
		roleName: string;
		roleDesc: string;
	};

	type RoleQueryParams = {
		roleName?: string;
	} & API.PageRequest;

	type RoleUpdateParams = {
		id: string;
		roleName: string;
		roleDesc: string;
	};
}
