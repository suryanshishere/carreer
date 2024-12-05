export const admissionPopulate = [
  {
    path: "common",
    select: "-post_exam_duration -post_exam_toughness_ranking",
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
      "counseling_start_date counseling_end_date counseling_result_announcement_date additional_resources",
  },
  {
    path: "important_links",
    select:
      "get_admit_card additional_resources view_results counseling_portal verify_certificates",
  },
];
