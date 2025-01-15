/** logo 地址 */
export const LOGO_URL = "/public/vite.svg";

/** 本地缓存枚举 */
export enum LocalStorageEnum {
  LOGIN_USER = "login_user",
  JWT = "jwt",
}

/** 本地缓存枚举 */
export enum UserRoleEnum {
  USER = "user",
  ADMIN = "admin",
  BAN = "ban",
}

/** COS 访问地址 */
export const COS_HOST = "https://github.com/shuaigef";

/** 文件上传业务类型枚举 */
export enum FileUploadBizEnum {
  /** 用户头像 */
  USER_AVATAR = "user_avatar",
}

/** 验证码发送业务类型枚举 */
export enum VerificationCodeBizEnum {
  /** 邮箱注册 */
  EMAIL_REGISTER = "email_register",
  /** 邮箱修改 */
  EMAIL_UPDATE = "email_update",
}
