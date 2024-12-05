export const admitCardPopulate = [
  {
    path: "important_dates",
    select:
      "result_announcement_date answer_key_release_date exam_date answer_key_release_date",
  },
  {
    path: "important_links",
    select:
      "official_website get_admit_card download_sample_papers additional_resources",
  },
  { path: "common", select: "-eligibility" },
  { path: "syllabus", select: "syllabus" },
];
export const admitCardListPopulate = [
  {
    path: "important_dates",
    select:
      "result_announcement_date answer_key_release_date exam_date answer_key_release_date",
  },
  {
    path: "important_links",
    select:
      "official_website get_admit_card download_sample_papers additional_resources",
  }
];
