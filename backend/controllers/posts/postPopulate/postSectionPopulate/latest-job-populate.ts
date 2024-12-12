export const latestJobPopulate = [
  // { path: "result_data", select: "result_data" },
  // { path: "syllabus", select: "syllabus" },
  {
    path: "important_links",
    select:
      "apply_online register_now official_website download_sample_papers additional_resources",
  },
  { path: "important_dates", select: "-approved" },
  { path: "application_fee", select: "-approved"  },
  {
    path: "common",
    select: "-approved",
  },
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
