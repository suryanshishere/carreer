// ------------------------------------ POST DATA LIMITS

import { IDates } from "../components/Date";

interface CharLimits {
  min: number;
  max: number;
}

interface IPostLimits {
  lowercase_alpha_num_underscrore: RegExp;
  rank_minute_num: CharLimits;
  medium_char_limit: CharLimits;
  short_char_limit: CharLimits;
  // super_short_limit: CharLimits;
  long_char_limit: CharLimits;
  dropdown_data: {
    job_type: string[];
    stage_level: string[];
    post_exam_mode: string[];
    applicants_gender_that_can_apply: string[];
  };
  non_negative_num: CharLimits;
  age_num: CharLimits;
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

export const POST_LIMITS_DB: IPostLimits = {
  lowercase_alpha_num_underscrore: /^[a-z0-9_]+$/,
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
    date_keys: ["current_year"],
  },
};

//POST DB

export type ISectionKey =
  | "result"
  | "admit_card"
  | "latest_job"
  | "syllabus"
  | "answer_key"
  | "certificate_verification"
  | "important"
  | "admission";

export type IComponentKey = "date" | "common" | "link" | "fee";

export type IOverallKey = ISectionKey | IComponentKey;

interface IPostEnvData {
  sections: ISectionKey[];
  components: IComponentKey[];
  overall: IOverallKey[];
}

const POST_DB: IPostEnvData = {
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

POST_DB.overall = [...POST_DB.sections, ...POST_DB.components];
export default POST_DB;

// POST MODEL

export interface PopulateOption {
  path: string;
  select?: string;
}

export type IOverPostRefKey =
  | "link_ref"
  | "common_ref"
  | "date_ref"
  | "result_ref"
  | "syllabus_ref"
  | "answer_key_ref"
  | "admit_card_ref"
  | "certificate_verification_ref"
  | "important_ref"
  | "admission_ref"
  | "fee_ref"
  | "latest_job_ref";

export const TAG_DATE_MAP: Record<ISectionKey, (keyof IDates)[]> = {
  result: ["result_announcement_date"],
  latest_job: ["application_start_date", "application_end_date"],
  answer_key: ["answer_key_release_date"],
  syllabus: ["application_start_date", "application_end_date"],
  certificate_verification: ["certificate_verification_date"],
  admission: ["counseling_start_date", "counseling_end_date"],
  important: ["important_date"],
  admit_card: ["admit_card_release_date"],
};

export type ITagKey = "live" | "upcoming" | "released" | "expiring" | "none";

export const TAG_ORDER: ITagKey[] = ["expiring", "live", "upcoming", "released", "none"];

export const TAGS: Record<ITagKey, [number, number] | null> = {
  live: [-3, 3],
  upcoming: [3, 80],
  released: [-300, -3],
  expiring: [1111, 2812],
  none: null,
};

//post priority order for post details
export const POST_DETAILS_PRIORITY: Record<ISectionKey, string[]> = {
  latest_job: [
    "latest_job_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.eligibility",
    "common_ref.applicants",
    "latest_job_ref.how_to_fill_the_form",
    "common_ref.age_criteria",
    "common_ref.job_type",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_toughness_ranking",
    "fee_ref",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.vacancy",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  result: [
    "result_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "result_ref.how_to_download_result",
    "result_ref.result",
    "common_ref.job_type",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.vacancy",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  admit_card: [
    "admit_card_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "admit_card_ref.how_to_download_admit_card",
    "common_ref.applicants_gender_that_can_apply",
    "syllabus_ref.syllabus",
    "common_ref.job_type",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.vacancy.detail",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  answer_key: [
    "answer_key_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "answer_key_ref.how_to_download_answer_key",
    "common_ref.post_exam_mode",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.post_importance",
    "common_ref.vacancy",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  admission: [
    "admission_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "common_ref.post_exam_mode",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.post_importance",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  certificate_verification: [
    "certificate_verification_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  important: [
    "important_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "important_ref.how_to_fill_the_form",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  syllabus: [
    "syllabus_ref.name_of_the_post",
    "last_updated",
    "common_ref.short_information",
    "common_ref.department",
    "common_ref.stage_level",
    "syllabus_ref.syllabus",
    "common_ref.department",
    "common_ref.stage_level",
    "common_ref.applicants",
    "common_ref.post_exam_mode",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
};
