export const COMMON_COMPONENT_POST_CHAR_LIMITS = {
  short_information: { min: 100, max: 2500 },
  highlighted_information: { min: 50, max: 500 },
  department: { min: 5, max: 100 },
  stage_level: { min: 5, max: 50 },
};

export const POST_ENV_DATA = {
  ALPHA_NUM_UNDERSCRORE: /^[A-Za-z0-9_]+$/,
  MIN_POST_NAME_PUBLISHER: Number(process.env.MIN_POST_NAME_PUBLISHER) || 6,
  MIN_POST_NAME: Number(process.env.MIN_POST_NAME) || 20,
  MAX_POST_NAME: Number(process.env.MAX_POST_NAME) || 1000,
  MIN_POST_CODE: Number(process.env.MIN_POST_CODE) || 6,
  MAX_POST_CODE: Number(process.env.MAX_POST_CODE) || 100,
};

export const CONTACT_US_ENV_DATA = {
  MIN_NAME_LENGTH: Number(process.env.MIN_NAME_LENGTH) || 3,
  MAX_NAME_LENGTH: Number(process.env.MAX_NAME_LENGTH) || 100,
  MIN_REASON_LENGTH: Number(process.env.MIN_REASON_LENGTH) || 100,
  MAX_REASON_LENGTH: Number(process.env.MAX_REASON_LENGTH) || 500,
};

export const USER_ENV_DATA = {
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
};

export const ADMIN_DATA = {
  PUBLISHER_STATUS: ["pending", "approved", "rejected"],
  PUBLISHER_DOC_EXPIRY: "30d",
};
