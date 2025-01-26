interface ContactUsEnvData {
  MIN_NAME_LENGTH: number;
  MAX_NAME_LENGTH: number;
  MIN_REASON_LENGTH: number;
  MAX_REASON_LENGTH: number;
}

interface AdminData {
  STATUS: string[];
  STATUS_DEFAULT: string;
  ROLE_APPLIED: string[];
  REQUEST_DOC_EXPIRY: number;
}

// -------------------------------------------

export const CONTACT_US_ENV_DATA: ContactUsEnvData = {
  MIN_NAME_LENGTH: Number(process.env.MIN_NAME_LENGTH) || 3,
  MAX_NAME_LENGTH: Number(process.env.MAX_NAME_LENGTH) || 100,
  MIN_REASON_LENGTH: Number(process.env.MIN_REASON_LENGTH) || 100,
  MAX_REASON_LENGTH: Number(process.env.MAX_REASON_LENGTH) || 500,
};

// ---------------------------------------------

// enum AccountMode {
//   MAX = "max",
// }

// export type AccountModeType = keyof typeof AccountMode;

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
};

export const ADMIN_DATA: AdminData = {
  STATUS: ["pending", "approved", "rejected"],
  STATUS_DEFAULT: "pending",
  ROLE_APPLIED: ["publisher", "admin", "approver", "none"],
  REQUEST_DOC_EXPIRY: 43200, // in min (everything is in minute)
};
