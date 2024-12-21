export const syllabusPopulate = [
  { path: "important_dates", select: "additional_resources" },
  { path: "important_links", select: "official_website" },
  { path: "common", select: "-approved" },
];

export const syllabusListPopulate = [
  { path: "important_dates", select: "application_start_date additional_resources" },
  { path: "important_links", select: "official_website" },
];
