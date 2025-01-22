interface IPostEnvData {
  ALPHA_NUM_UNDERSCORE: RegExp;
  ALPHA_NUM_UNDERSCORE_SPACE: RegExp;
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
  ALPHA_NUM_UNDERSCORE: /^[A-Za-z0-9_]+$/,
  ALPHA_NUM_UNDERSCORE_SPACE:/^[A-Za-z0-9_\s]+$/,
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

// -------------------------------------------------------

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
