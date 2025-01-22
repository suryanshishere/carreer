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

// ------------------------------------ POST DATA LIMITS

interface CharLimits {
  min: number;
  max: number;
}

interface IPostLimits {
  rank_num: CharLimits;
  medium_char_limit: CharLimits;
  short_char_limit: CharLimits;
  // super_short_limit: CharLimits;
  long_char_limit: CharLimits;
  job_type: string[];
  stage_level: string[];
  post_exam_mode: string[];
  applicants_gender_that_can_apply: string[];
  non_negative_num: CharLimits;
  minute_num: CharLimits;
  age_num: CharLimits;
}

export const POST_LIMITS: IPostLimits = {
  long_char_limit: { min: 100, max: 2500 },
  medium_char_limit: { min: 25, max: 500 },
  short_char_limit: { min: 3, max: 200 },
  non_negative_num: {
    min: 0,
    max: 10000000000,
  },
  rank_num: { min: 1, max: 10000 },
  minute_num: { min: 11, max: 1440 },
  age_num: { min: 11, max: 100 },
  job_type: [
    "permanent",
    "temporary",
    "contractual",
    "part_time",
    "internship",
  ],
  stage_level: [
    "national",
    "state",
    "district",
    "regional",
    "local",
    "international",
  ],
  applicants_gender_that_can_apply: ["male", "female", "other", "all"],
  post_exam_mode: ["online", "offline_paper_based", "offline_computer_based"],
};

// ------------------------------ POST DATA

interface IPostEnvData {
  LOWERCASE_ALPHA_NUM_UNDERSCORE: RegExp;
  MIN_POST_NAME_PUBLISHER: number;
  MAX_POST_NAME_PUBLISHER: number;
  MIN_POST_NAME: number;
  MAX_POST_NAME: number;
  MIN_POST_CODE: number;
  MAX_POST_CODE: number;
  SECTIONS: string[];
  COMPONENTS: string[];
  OVERALL: string[];
}

const POST_ENV_DATA: IPostEnvData = {
  LOWERCASE_ALPHA_NUM_UNDERSCORE: /^[a-z0-9_]+$/,
  MIN_POST_NAME_PUBLISHER: Number(process.env.MIN_POST_NAME_PUBLISHER) || 6,
  MAX_POST_NAME_PUBLISHER: Number(process.env.MAX_POST_NAME_PUBLISHER) || 750,
  MIN_POST_NAME: Number(process.env.MIN_POST_NAME) || 20,
  MAX_POST_NAME: Number(process.env.MAX_POST_NAME) || 750,
  MIN_POST_CODE: Number(process.env.MIN_POST_CODE) || 6,
  MAX_POST_CODE: Number(process.env.MAX_POST_CODE) || 100,
  SECTIONS: [
    "result",
    "admit_card",
    "latest_job",
    "answer_key",
    "syllabus",
    "certificate_verification",
    "admission",
    "important",
  ],
  COMPONENTS: ["date", "common", "link", "fee"],
  OVERALL: [],
};

// Populate OVERALL dynamically
POST_ENV_DATA.OVERALL = [
  ...POST_ENV_DATA.SECTIONS,
  ...POST_ENV_DATA.COMPONENTS,
];
export { POST_ENV_DATA };

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
