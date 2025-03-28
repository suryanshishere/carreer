export interface IUserEnvData {
  ALPHA_NUM_SPECIAL_CHAR: RegExp;
  MIN_PWD_LENGTH: number;
  MAX_PWD_LENGTH: number;
  MIN_EMAIL_OTP: number;
  MAX_EMAIL_OTP: number;
  EMAIL_VERIFICATION_OTP_EXPIRY: number;
  PASSWORD_RESET_TOKEN_EXPIRY: number;
  PWD_RESET_ERROR_MSG: string;
  OTP_ERROR_MSG: string;
  // ACCOUNT_MODE: AccountModeType;
  EMAIL_UNVERIFIED_EXPIRY: number;
  JWT_KEY_EXPIRY: number;
  JWT_KEY: string;
}

export const USER_ENV_DATA: IUserEnvData = {
  ALPHA_NUM_SPECIAL_CHAR: /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_+\\-]*$/,
  MIN_PWD_LENGTH: Number(process.env.MIN_PWD_LENGTH) || 6,
  MAX_PWD_LENGTH: Number(process.env.MAX_PWD_LENGTH) || 50,
  MIN_EMAIL_OTP: Number(process.env.MIN_EMAIL_OTP) || 100000,
  MAX_EMAIL_OTP: Number(process.env.MAX_EMAIL_OTP) || 999999,
  EMAIL_VERIFICATION_OTP_EXPIRY:
    Number(process.env.EMAIL_VERIFICATION_OTP_EXPIRY) || 3,
  PASSWORD_RESET_TOKEN_EXPIRY:
    Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 3,
  PWD_RESET_ERROR_MSG: "Invalid password reset token!",
  OTP_ERROR_MSG: "Invalid OTP!",
  // ACCOUNT_MODE: AccountMode,
  EMAIL_UNVERIFIED_EXPIRY: Number(process.env.EMAIL_UNVERIFIED_EXPIRY) || 30,
  JWT_KEY_EXPIRY: Number(process.env.JWT_KEY_EXPIRY) || 1000,
  JWT_KEY: process.env.JWT_KEY || "",
};
