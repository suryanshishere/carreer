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

// Common interface for list data with basic fields
export interface ICommonListData {
  result_ref: { name_of_the_post: string };
  admission_ref: { name_of_the_post: string };
  answer_key_ref: { name_of_the_post: string };
  certificate_verification_ref: { name_of_the_post: string };
  syllabus_ref: { name_of_the_post: string };
  admit_card_ref: { name_of_the_post: string };
  important_ref: { name_of_the_post: string };
  latest_job_ref: { name_of_the_post: string };
  updatedAt: string;
  _id: string;
  is_saved: boolean;
  post_code: string;
  version: string;
  link_ref?: ILinks;
  date_ref: IDates;
}

interface AdditionalResources {
  faq: string;
  contact_us: string;
  important_dates: string;
}

export interface ILinks {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  approved: boolean;
  official_website?: string;
  apply_online?: string;
  register_now?: string;
  download_sample_papers?: string;
  get_admit_card?: string;
  view_results?: string;
  check_answer_key?: string;
  counseling_portal?: string;
  verify_certificates?: string;
  additional_resources?: AdditionalResources;
}

export interface IDateRange {
  current_year?: string;
  previous_year: string;
}

export type IDatesOnly = Record<string, IDateRange>;

export interface IDates {
  createdAt: string;
  updatedAt: string;
  created_by: string;
  contributors?: string[];
  application_start_date?: IDateRange;
  application_end_date?: IDateRange;
  exam_fee_payment_end_date?: IDateRange;
  form_correction_start_date?: IDateRange;
  form_correction_end_date?: IDateRange;
  exam_date?: IDateRange;
  admit_card_release_date?: IDateRange;
  exam_city_details_release_date?: IDateRange;
  answer_key_release_date?: IDateRange;
  result_announcement_date?: IDateRange;
  counseling_start_date?: IDateRange;
  counseling_end_date?: IDateRange;
  counseling_result_announcement_date?: IDateRange;
  certificate_verification_date?: IDateRange;
  important_date?: IDateRange;
  additional_resources?: string;
}

export interface IContribute {
  keyProp: string;
  valueProp: string | number;
}

//post priorities

export const POST_DETAILS_PRIORITY: { [key: string]: string[] } = {
  latest_job: [
    "latest_job_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.eligibility",
    "common_ref.applicants",
    "latest_job_ref.how_to_fill_the_form",
    "common_ref.age_criteria",
    "common_ref.vacancy",
    "date_ref",
    "link_ref",
    "fee_ref",
  ],
  result: [
    "result_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "result_ref.how_to_download_result",
    "result_ref.result",
    "link_ref",
    "common_ref.vacancy",
  ],
  admit_card: [
    "admit_card_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "admit_card_ref.how_to_download_admit_card",
    "date_ref",
    "syllabus_ref.syllabus",
    "link_ref",
  ],
  answer_key: [
    "answer_key_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "answer_key_ref.how_to_download_answer_key",
    "date_ref",
    "link_ref",
    "common_ref.vacancy",
  ],
  admission: [
    "admission_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "date_ref",
    "link_ref",
  ],
  certificate_verification: [
    "certificate_verification_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "date_ref",
    "link_ref",
  ],
  important: [
    "important_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "date_ref",
    "link_ref",
  ],
  syllabus: [
    "syllabus_ref.name_of_the_post",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "syllabus_ref.syllabus",
    "date_ref",
    "link_ref",
  ],
};


export const excludedKeys = [
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
  "contributors",
  "is_saved",
  "__v",
  "post_code",
  "version",
  "admit_card_ref",
  "certificate_verification_ref",
  "result_ref",
  "answer_key_ref",
  "latest_job_ref",
  "latest_job_ref",
];

export const notDisplayKeys = [];

// "common_ref"
export const tableRequired = [
  "age_criteria",
  "result_ref.result",
  "male",
  "female",
  "other",
  "common_ref.vacancy.category_wise",
  "link_ref",
  "date_ref",
  "eligibility",
  "applicants",
  "fee_ref.category_wise",
  "common_ref.age_criteria",
  "link_ref.additional_resources",
  "result_ref.result.current_year",
  "result_ref.result.previous_year",
];


export const excludedPostListKeys = [
  "_id",
  "name_of_the_post",
  "updatedAt",
  "is_saved",
  "approved",
  "contributors",
  "__v",
  "post_code",
  "admit_card_ref",
  "result_ref",
  "certificate_verification_ref",
  "admission_ref",
  "latest_job_ref",
  "answer_key_ref",
  "syllabus_ref",
  "admission_ref",
  "important_ref",
  "version"
];
