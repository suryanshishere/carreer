interface IPostDb {
  sections: string[];
  components: string[];
  overall: string[];
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
};

// Populate OVERALL dynamically
POST_DB.overall = [...POST_DB.sections, ...POST_DB.components];
export default POST_DB;

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
  dropdown_data: {
    job_type: string[];
    stage_level: string[];
    post_exam_mode: string[];
    applicants_gender_that_can_apply: string[];
  };
  non_negative_num: ICharNumLimitsDb;
  age_num: ICharNumLimitsDb;
  limit_keys_division: {
    dropdown_keys: string[];
    long_char_keys: string[];
    medium_char_keys: string[];
    short_char_keys: string[];
    non_negative_num_keys: string[];
    rank_minute_num_keys: string[];
    age_num_keys: string[];
    date_keys: string[];
  };
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
  dropdown_data: {
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
  },
  limit_keys_division: {
    dropdown_keys: [
      "job_type",
      "post_exam_mode",
      "applicants_gender_that_can_apply",
      "stage_level",
    ],
    long_char_keys: [
      "short_information",
      "highlighted_information",
      "post_importance",
      "how_to_download_admit_card",
      "how_to_download_answer_key",
      "how_to_fill_the_form",
      "registration",
      "apply",
      "how_to_download_result",
      "sources_and_its_step_to_download_syllabus",
      "topics",
    ],
    medium_char_keys: ["name_of_the_post"],
    short_char_keys: [
      "department",
      "age_relaxation",
      "post_name",
      "post_eligibility",
      "additional_resources",
      "minimum_qualification",
      "other_qualification",
      "apply_online",
      "official_website",
      "register_now",
      "download_sample_papers",
      "get_admit_card",
      "view_results",
      "check_answer_key",
      "counseling_portal",
      "verify_certificates",
      "faq",
      "contact_us",
      "video_link",
      "section",
    ],
    non_negative_num_keys: [
      "number_of_applicants_each_year",
      "number_of_applicants_selected",
      "total_post",
      "general",
      "obc",
      "sc",
      "st",
      "ews",
      "ph_dviyang",
      "male",
      "female",
    ],
    rank_minute_num_keys: ["post_exam_toughness_ranking", "post_exam_duration"],
    age_num_keys: ["minimum_age", "maximum_age"],
    date_keys: ["current_year", "previous_year"],
  },
};

//flatten the dropdown data
export const POST_LIMIT_DROPDOWN_DATA = new Set(
  Object.values(POST_LIMITS_DB.dropdown_data).flat()
);
