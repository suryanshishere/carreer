export const importantPopulate = [
  { path: "common", select: "short_information department stage_level" },
  { path: "important_dates", select: "additional_resources" },
  { path: "important_links", select: "official_website additional_resources" },
];
