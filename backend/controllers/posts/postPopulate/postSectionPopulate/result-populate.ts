export const populateResult = [
  {
    path: "important_links",
    select: "view_results official_website additional_resources",
  },
  {
    path: "common",
    select: "-post_exam_duration -age_criteria -eligibility -approved",
  },
  {
    path: "important_dates",
    select:
      "result_announcement_date additional_resources counseling_result_announcement_date counseling_end_date counseling_start_date ",
  },
];

export const resultListPopulate = [
  {
    path: "important_links",
    select: "view_results official_website -_id",
  },
  {
    path: "important_dates",
    select: "result_announcement_date -_id",
  },
];
