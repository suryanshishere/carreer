interface IPostDb {
  sections: string[];
  components: string[];
  overall: string[];
  tags: {
    color: string;
    label: string;
    daysRange?: [number, number];
  }[];
}

const POST_DB: IPostDb = {
  sections: [
    "result",
    "admit_card",
    "latest_job",
    "answer_key",
    "syllabus",
    "certificate_verification",
    "admission",
    "important",
  ],
  components: ["date", "common", "link", "fee"],
  overall: [],
  tags: [
    { color: "custom-green", label: "LIVE", daysRange: [-3, 2] },
    { color: "custom-pale-orange", label: "UPCOMING", daysRange: [3, 80] },
    { color: "custom-gray", label: "RELEASED", daysRange: [-80, -4] },
    {
      color: "custom-red animate-pulse",
      label: "EXPIRING",
      daysRange: [-3, 0],
    },
    { color: "custom-black", label: "VISITED" },
  ],
};

// Populate OVERALL dynamically
POST_DB.overall = [...POST_DB.sections, ...POST_DB.components];
export { POST_DB };

// -------------------------------------------------------

interface ICharNumLimitsDb {
  min: number;
  max: number;
}

interface IPostLimitsDb {
  lowercase_alpha_num_underscrore: RegExp;
  alpha_num_underscore_space: RegExp;
  rank_minute_num: ICharNumLimitsDb;
  medium_char_limit: ICharNumLimitsDb;
  short_char_limit: ICharNumLimitsDb; 
  long_char_limit: ICharNumLimitsDb;
  job_type: string[];
  stage_level: string[];
  post_exam_mode: string[];
  applicants_gender_that_can_apply: string[];
  non_negative_num: ICharNumLimitsDb;
  age_num: ICharNumLimitsDb;
}

export const POST_LIMITS_DB: IPostLimitsDb = {
  lowercase_alpha_num_underscrore: /^[a-z0-9_]+$/,
  alpha_num_underscore_space: /^[A-Za-z0-9_\s]+$/,
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
