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
  upcoming: [3, 40],
  released: [-100, -3],
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
    "common_ref.age_criteria",
    "common_ref.job_type",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "fee_ref",
    "latest_job_ref.how_to_fill_the_form",
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
    "result_ref.result",
    "common_ref.job_type",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "result_ref.how_to_download_result",
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
    "syllabus_ref.syllabus",
    "common_ref.job_type",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "admit_card_ref.how_to_download_admit_card",
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
    "common_ref.post_exam_mode",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "answer_key_ref.how_to_download_answer_key",
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
    //how to add admission details
    "common_ref.post_exam_mode",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "common_ref.",
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
    "important_ref.how_to_fill_the_form",
    "common_ref.applicants",
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
    "common_ref.eligibility",
    "common_ref.age_criteria",
    "common_ref.job_type",
    "common_ref.post_exam_duration",
    "common_ref.post_exam_mode",
    "common_ref.post_exam_toughness_ranking",
    "common_ref.applicants_gender_that_can_apply",
    "common_ref.applicants",
    "fee_ref",
    "latest_job_ref.how_to_fill_the_form",
    "common_ref.vacancy",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
};


export const EXCLUDED_KEYS: Record<string, boolean> = {
  _id: true,
  created_by: true,
  createdAt: true,
  updatedAt: true,
  contributors: true,
  is_saved: true,
  dynamic_field: true,
  __v: true,
  post_code: true,
  version: true,
  admit_card_ref: true,
  result_ref: true,
  certificate_verification_ref: true,
  admission_ref: true,
  latest_job_ref: true,
  answer_key_ref: true,
  syllabus_ref: true,
  important_ref: true,
  admit_card_approved: true,
  result_approved: true,
  certificate_verification_approved: true,
  admission_approved: true,
  latest_job_approved: true,
  answer_key_approved: true,
  syllabus_approved: true,
  important_approved: true,
  name_of_the_post: true,
  approved: true,
  tag: true,
};


export const NON_REQUIRED_FIELD: Record<string, boolean> = {
  "latest_job_ref.how_to_fill_the_form.video_link": true,
  "result_ref.result.current_year": true,
  "common_ref.vacancy.category_wise.general": true,
  "common_ref.vacancy.category_wise.obc": true,
  "common_ref.vacancy.category_wise.ews": true,
  "common_ref.vacancy.category_wise.sc": true,
  "common_ref.vacancy.category_wise.st": true,
  "common_ref.vacancy.category_wise.ph_dviyang": true,
  "common_ref.post_exam_duration": true,
  "common_ref.eligibility.other_qualification": true,
  "date_ref.exam_fee_payment_end_date": true,
  "date_ref.form_correction_start_date": true,
  "date_ref.form_correction_end_date": true,
  "date_ref.exam_date": true,
  "date_ref.exam_city_details_release_date": true,
  "date_ref.counseling_result_announcement_date": true,
  "fee_ref.male": true,
  "fee_ref.female": true,
  "fee_ref.category_wise.general": true,
  "fee_ref.category_wise.obc": true,
  "fee_ref.category_wise.ews": true,
  "fee_ref.category_wise.sc": true,
  "fee_ref.category_wise.st": true,
  "fee_ref.category_wise.ph_dviyang": true,
  "link_ref.apply_online":true,
  "link_ref.register_now":true,
  "link_ref.download_sample_papers":true,
  "link_ref.admit_card":true,
  "link_ref.view_results":true,
  "link_ref.check_answer_key":true,
  "link_ref.conseling_portal":true,
  "link_ref.verify_certificates":true,
};