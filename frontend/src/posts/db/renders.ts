import { ISectionKey } from ".";

export const POST_DETAILS_PRIORITY: Record<ISectionKey, string[]> = {
  latest_job: [
    "latest_job_ref.name_of_the_post",
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
    "common_ref.short_information",
    "common_ref.department",
    "common_ref",
    "date_ref",
    "link_ref",
  ],
  important: [
    "important_ref.name_of_the_post",
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
];

export const notDisplayKeys = [];

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
  "version",
];

export const collapsible = ["result_ref.result.previous_year"];

export const renamingKeys: {
  [key: string]: string;
} = {
  date_ref: "Important Dates",
  link_ref: "Important Links",
  common_ref: "Common Information",
};

export interface IRenamingValues {
  [key: string]: string | IRenamingValues;
}

export const renamingValues: IRenamingValues = {
  stage_level: {
    national:
      "National Level - Open to participants across the entire country, fostering large-scale competition.",
    state:
      "State Level - Limited to a particular state, ensuring more localized participation.",
    district:
      "District Level - Open only within a specific district, often for more focused recruitment.",
    regional:
      "Regional Level - Covers multiple districts but stays within a specific geographic region.",
    local:
      "Local Level - Restricted to a city, town, or specific locality for niche opportunities.",
    international:
      "International Level - Open globally, inviting competition beyond national borders.",
  },
  applicants_gender_that_can_apply: {
    male: "Male - This position is open exclusively for male applicants.",
    female: "Female - Only female candidates are eligible for this post.",
    other:
      "Other - Open to applicants identifying as non-binary or other genders.",
    all: "All - Inclusive opportunity for everyone, regardless of gender.",
  },
  post_exam_mode: {
    online:
      "Online - The exam will be conducted over the internet, accessible remotely.",
    offline_paper_based:
      "Offline (Paper-Based) - Candidates must attend a physical test center to take a written paper exam.",
    offline_computer_based:
      "Offline (Computer-Based) - Conducted at a designated center where candidates take the test on computers.",
  },
  job_type: {
    permanent:
      "Permanent - A full-time job with long-term employment benefits and stability.",
    temporary:
      "Temporary - Short-term employment for a fixed duration, often project-based.",
    contractual:
      "Contractual - Fixed-period employment based on a contractual agreement.",
    part_time: "Part-Time - Work with reduced hours, offering flexibility.",
    internship:
      "Internship - Learning-based job experience for students or freshers, usually for a limited period.",
  },
  post_exam_toughness_ranking: "ranked",
  post_exam_duration: "minutes",
  minimum_age: "year old",
  maximum_age: "year old",
};
