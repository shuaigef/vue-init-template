declare namespace API {
	// region 通用
	/** 自定义请求返回 data 格式 */
	type BaseResponse<T> = {
		code: number;
		data: T; // 这里定义请求返回data数据类型
		message: string;
	};

	/** 分页请求参数 */
	type PageRequest = {
		current: number;
		pageSize: number;
		sortField?: string;
		sortOrder?: string;
	};

	/** 分页数据返回格式 */
	type Page<T> = {
		records: T[];
		total: number;
		size: number;
		current: number;
	};
	// endregion
}
