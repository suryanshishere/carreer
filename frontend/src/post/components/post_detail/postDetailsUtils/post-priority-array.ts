 const latest_job_priority = [
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
];

 const result_priority = [
  "result_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "common_ref.applicants",
  "result_ref.how_to_download_result",
  "result_ref.result",
  "link_ref",
  "common_ref.vacancy",
];

 const admit_card_priority = [
  "admit_card_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "common_ref.applicants",
  "admit_card_ref.how_to_download_admit_card",
  "date_ref",
  "syllabus_ref.syllabus",
  "link_ref",
];

 const answer_key_priority = [
  "answer_key_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "common_ref.applicants",
  "answer_key_ref.how_to_download_answer_key",
  "date_ref",
  "link_ref",
  "common_ref.vacancy",
];

 const admission_priority = [
  "admission_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "common_ref.applicants",
  "date_ref",
  "link_ref",
];

 const certificate_verification_priority = [
  "certificate_verification_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "date_ref",
  "link_ref",
];

 const important_priority = [
  "important_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "common_ref.applicants",
  "date_ref",
  "link_ref",
];

const syllabus_priority = [
  "syllabus_ref.name_of_the_post",
  "common_ref.short_information",
  "common_ref.department",
  "common_ref.stage_level",
  "syllabus_ref.syllabus",
  "date_ref",
  "link_ref",
];

export const postDetailPriorities: { [key: string]: string[] } = {
  latest_job_priority,
  result_priority,
  admit_card_priority,
  answer_key_priority,
  admission_priority,
  certificate_verification_priority,
  important_priority,
  syllabus_priority,
};