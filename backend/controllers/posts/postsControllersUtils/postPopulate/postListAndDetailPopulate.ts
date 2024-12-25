// Syllabus related populate configurations
export const syllabusPopulate = [
  { path: "important_dates", select: "additional_resources" },
  { path: "important_links", select: "official_website" },
  { path: "common", select: "-approved" },
];

export const syllabusListPopulate = [
  {
    path: "important_dates",
    select: "application_start_date additional_resources",
  },
  { path: "important_links", select: "official_website" },
];

// Result related populate configurations
export const populateResult = [
  {
    path: "important_links",
    select: "view_results official_website additional_resources",
  },
  {
    path: "common",
    select: "-post_exam_duration -age_criteria -eligibility -approved -__v",
  },
  {
    path: "important_dates",
    select:
      "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date",
  },
];

export const resultListPopulate = [
  {
    path: "important_links",
    select: "view_results official_website",
  },
  {
    path: "important_dates",
    select: "result_announcement_date",
  },
];

// Latest Job related populate configurations
export const latestJobPopulate = [
  {
    path: "important_links",
    select:
      "apply_online register_now official_website download_sample_papers additional_resources",
  },
  { path: "important_dates", select: "-approved" },
  { path: "application_fee", select: "-approved" },
  { path: "common", select: "-approved" },
];

export const latestJobListPopulate = [
  {
    path: "important_links",
    select: "apply_online register_now official_website",
  },
  {
    path: "important_dates",
    select: "application_start_date application_end_date exam_date",
  },
];

// Important data related populate configurations
export const importantPopulate = [
  { path: "common", select: "short_information department stage_level" },
  { path: "important_dates", select: "additional_resources" },
  { path: "important_links", select: "official_website additional_resources" },
];

export const importantListPopulate = [
  { path: "important_dates", select: "additional_resources" },
  { path: "important_links", select: "official_website additional_resources" },
];

// Certificate Verification related populate configurations
export const certificateVerificationPopulate = [
  {
    path: "important_links",
    select:
      "get_admit_card check_answer_key view_results official_website additional_resources",
  },
  { path: "important_dates", select: "additional_resources" },
  { path: "common", select: "short_information department eligibility" },
];

export const certificateVerificationListPopulate = [
  {
    path: "important_links",
    select: "official_website additional_resources",
  },
  { path: "important_dates", select: "certificate_verification_date" },
];

// Answer Key related populate configurations
export const answerKeyPopulate = [
  { path: "common", select: "-eligibility -approved" },
  {
    path: "important_dates",
    select:
      "answer_key_release_date result_announcement_date counseling_start_date counseling_end_date counseling_result_announcement_date",
  },
  {
    path: "important_links",
    select: "official_website check_answer_key get_admit_card",
  },
  { path: "syllabus", select: "syllabus" },
];

export const answerKeyListPopulate = [
  {
    path: "important_dates",
    select: "answer_key_release_date result_announcement_date",
  },
  {
    path: "important_links",
    select: "official_website check_answer_key get_admit_card",
  },
];

// Admit Card related populate configurations
export const admitCardPopulate = [
  {
    path: "important_dates",
    select:
      "result_announcement_date admit_card_release_date answer_key_release_date exam_date",
  },
  {
    path: "important_links",
    select:
      "official_website get_admit_card download_sample_papers additional_resources",
  },
  { path: "common", select: "-eligibility -approved" },
  { path: "syllabus", select: "syllabus" },
];

export const admitCardListPopulate = [
  {
    path: "important_dates",
    select: "admit_card_release_date exam_date",
  },
  {
    path: "important_links",
    select: "official_website get_admit_card download_sample_papers",
  },
];

// Admission related populate configurations
export const admissionPopulate = [
  {
    path: "common",
    select: "-post_exam_duration -post_exam_toughness_ranking -approved",
  },
  {
    path: "important_dates",
    select:
      "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources",
  },
  {
    path: "important_links",
    select:
      "get_admit_card additional_resources view_results counseling_portal verify_certificates",
  },
];

export const admissionListPopulate = [
  {
    path: "important_dates",
    select:
      "counseling_start_date counseling_end_date counseling_result_announcement_date",
  },
  {
    path: "important_links",
    select: "view_results counseling_portal",
  },
];
