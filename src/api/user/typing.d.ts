declare namespace API {
  type UserUpdateBasicInfoParams = {
		username: string,
		nickname: string;
		userAvatar?: string;
		gender: number;
		userProfile?: string;
  }
}
