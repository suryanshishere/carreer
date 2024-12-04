import SECTIONS from "db/postDb/sections.json";

export const latest_job_priority = [
  "name_of_the_post",
  "common.short_information",
  "common.department",
  "common.stage_level",
  "common.eligibility",
  "common.applicants",
  "common.age_criteria",
  "common.vacancy",
  "how_to_fill_the_form",
  "important_dates",
  "important_links",
  "application_fee",
];

export const result_priority = [
  "name_of_the_post",
  "common.short_information",
  "common.department",
  "common.stage_level",
  "common.applicants",
  "how_to_download_result","result","important_links",
];

const allPriorities: { [key: string]: string[] } = {
  latest_job_priority,
  result_priority,
};

const priorityMap: { [key: string]: string[] } = {};

SECTIONS.forEach((section) => {
  const priorityKey = `${section}_priority`;
  if (priorityKey in allPriorities) {
    priorityMap[section] = allPriorities[priorityKey];
  } else {
    priorityMap[section] = [];
  }
});

export default priorityMap;
