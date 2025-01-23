interface IPostEnvData { 
  SECTIONS: string[];
  COMPONENTS: string[];
  OVERALL: string[];
}

const POST_DATA: IPostEnvData = {
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
POST_DATA.OVERALL = [
  ...POST_DATA.SECTIONS,
  ...POST_DATA.COMPONENTS,
];
export { POST_DATA };

// -------------------------------------------------------

interface CharLimits {
  min: number;
  max: number;
}

interface IPostLimits {
  lowercase_alpha_num_underscrore: RegExp;
  alpha_num_underscore_space: RegExp;
  rank_minute_num: CharLimits;
  medium_char_limit: CharLimits;
  short_char_limit: CharLimits;
  // super_short_limit: CharLimits;
  long_char_limit: CharLimits;
  job_type: string[];
  stage_level: string[];
  post_exam_mode: string[];
  applicants_gender_that_can_apply: string[];
  non_negative_num: CharLimits;
  age_num: CharLimits;
}

export const POST_LIMITS: IPostLimits = {
  lowercase_alpha_num_underscrore: /^[a-z0-9_]+$/,
  alpha_num_underscore_space:/^[A-Za-z0-9_\s]+$/,
  long_char_limit: { min: 100, max: 2500 },
  medium_char_limit: { min: 25, max: 700 },
  short_char_limit: { min: 3, max: 300 },
  non_negative_num: {
    min: 0,
    max: 10000000000,
  },
  rank_minute_num: { min: 1, max: 10000 },
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
