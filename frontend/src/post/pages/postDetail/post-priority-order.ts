import SECTIONS from "db/postDb/sections.json";
import { IPostDetail } from "models/postModels/IPostDetail";

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
  "how_to_download_result",
  "result",
  "important_links",
  "common.vacancy",
];

export const admit_card_priority = [
  "name_of_the_post",
  "common.short_information",
  "common.department",
  "common.stage_level",
  "common.applicants",
  "how_to_download_admit_card",
  "important_dates",
  "important_links",
];

const allPriorities: { [key: string]: string[] } = {
  latest_job_priority,
  result_priority,
  admit_card_priority,
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
export { priorityMap };

const rearrangeObjectByPriority = (
  data: IPostDetail,
  priorityKeys: string[]
) => {
  let result: { [key: string]: any } = {};

  priorityKeys.forEach((key) => {
    const keys = key.split("."); // Split by dot for nested keys
    let value: any = data;

    // Traverse nested keys
    keys.forEach((subKey) => {
      value = value ? value[subKey] : undefined;
    });

    // If a value is found, add it to the result and remove the key from data
    if (value !== undefined) {
      result[keys[keys.length - 1]] = value;

      // Remove the key(s) from the original data object
      let currentData: any = data;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          delete currentData[subKey]; // Delete the final key
        } else {
          currentData = currentData[subKey]; // Traverse deeper if it's a nested structure
        }
      });
    }
  });

  // Add the rest of the keys that are not in the priority list
  Object.keys(data).forEach((key) => {
    if (!priorityKeys.includes(key)) {
      result[key] = data[key as keyof IPostDetail];
    }
  });

  return result;
};

export default rearrangeObjectByPriority;
