// Syllabus related populate configurations
export const syllabusPopulate = [
  { path: "date_ref", select: "additional_resources" },
  { path: "link_ref", select: "official_website" },
  { path: "common_ref", select: "-approved" },
  { path: "syllabus_ref" },
];

export const syllabusListPopulate = [
  {
    path: "date_ref",
    select: "application_start_date additional_resources",
  },
  { path: "link_ref", select: "official_website" },
  { path: "syllabus_ref", select: "name_of_the_post" },
];

// Result related populate configurations
export const populateResult = [
  {
    path: "link_ref",
    select: "view_results official_website additional_resources",
  },
  {
    path: "common_ref",
    select: "-post_exam_duration -age_criteria -eligibility -approved -__v",
  },
  {
    path: "date_ref",
    select:
      "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date",
  },
  { path: "result_ref" },
];

export const resultListPopulate = [
  {
    path: "link_ref",
    select: "view_results official_website",
  },
  {
    path: "date_ref",
    select: "result_announcement_date",
  },
  { path: "result_ref", select: "name_of_the_post" },
];

// Latest Job related populate configurations
export const latestJobPopulate = [
  {
    path: "link_ref",
    select:
      "apply_online register_now official_website download_sample_papers additional_resources",
  },
  { path: "date_ref", select: "-approved" },
  { path: "application_fee", select: "-approved" },
  { path: "common_ref", select: "-approved" },
  { path: "latest_job_ref" },
];

export const latestJobListPopulate = [
  {
    path: "link_ref",
    select: "apply_online register_now official_website",
  },
  {
    path: "date_ref",
    select: "application_start_date application_end_date exam_date",
  },
  { path: "latest_job_ref", select: "name_of_the_post" },
];

// Important data related populate configurations
export const importantPopulate = [
  { path: "common_ref", select: "short_information department stage_level" },
  { path: "date_ref", select: "additional_resources important_date" },
  { path: "link_ref", select: "official_website additional_resources" },
  { path: "important_ref" },
];

export const importantListPopulate = [
  { path: "date_ref", select: "additional_resources important_date" },
  { path: "link_ref", select: "official_website additional_resources" },
  { path: "important_ref", select: "name_of_the_post" },
];

// Certificate Verification related populate configurations
export const certificateVerificationPopulate = [
  {
    path: "link_ref",
    select:
      "get_admit_card check_answer_key view_results official_website additional_resources",
  },
  { path: "date_ref", select: "additional_resources certificate_verification_date" },
  { path: "common_ref", select: "short_information department eligibility" },
  { path: "certificate_verification_ref" },
];

export const certificateVerificationListPopulate = [
  {
    path: "link_ref",
    select: "official_website additional_resources",
  },
  { path: "date_ref", select: "certificate_verification_date" },
  { path: "certificate_verification_ref", select: "name_of_the_post" },
];

// Answer Key related populate configurations
export const answerKeyPopulate = [
  { path: "common_ref", select: "-eligibility -approved" },
  {
    path: "date_ref",
    select:
      "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date",
  },
  {
    path: "link_ref",
    select: "official_website check_answer_key get_admit_card",
  },
  { path: "syllabus_ref", select: "syllabus" },
  { path: "answer_key_ref" },
];

export const answerKeyListPopulate = [
  {
    path: "date_ref",
    select: "answer_key_release_date result_announcement_date",
  },
  {
    path: "link_ref",
    select: "official_website check_answer_key get_admit_card",
  },
  { path: "answer_key_ref", select: "name_of_the_post" },
];

// Admit Card related populate configurations
export const admitCardPopulate = [
  {
    path: "date_ref",
    select:
      "result_announcement_date admit_card_release_date answer_key_release_date exam_date",
  },
  {
    path: "link_ref",
    select:
      "official_website get_admit_card download_sample_papers additional_resources",
  },
  { path: "common_ref", select: "-eligibility -approved" },
  { path: "syllabus_ref", select: "syllabus" },
  { path: "admit_card_ref" },
];

export const admitCardListPopulate = [
  {
    path: "date_ref",
    select: "admit_card_release_date exam_date",
  },
  {
    path: "link_ref",
    select: "official_website get_admit_card download_sample_papers",
  },
  { path: "admit_card_ref", select: "name_of_the_post" },
];

// Admission related populate configurations
export const admissionPopulate = [
  {
    path: "common_ref",
    select: "-post_exam_duration -post_exam_toughness_ranking -approved",
  },
  {
    path: "date_ref",
    select:
      "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources",
  },
  {
    path: "link_ref",
    select:
      "get_admit_card additional_resources view_results counseling_portal verify_certificates",
  },
  { path: "admission_ref" },
];

export const admissionListPopulate = [
  {
    path: "date_ref",
    select:
      "counseling_start_date counseling_end_date counseling_result_announcement_date",
  },
  {
    path: "link_ref",
    select: "view_results counseling_portal",
  },
  { path: "admission_ref", select: "name_of_the_post" },
];
