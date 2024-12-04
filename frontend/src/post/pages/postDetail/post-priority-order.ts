import SECTIONS from "db/postDb/sections.json";
import { IPostDetail } from "models/postModels/IPostDetail";
import {
  admission_priority,
  admit_card_priority,
  answer_key_priority,
  certificate_verification_priority,
  important_priority,
  latest_job_priority,
  result_priority,
  syllabus_priority,
} from "./post-priority-array";
import { snakeCase } from "lodash";

const allPriorities: { [key: string]: string[] } = {
  latest_job_priority,
  result_priority,
  admit_card_priority,
  answer_key_priority,
  admission_priority,
  certificate_verification_priority,
  important_priority,
  syllabus_priority,
};

const priorityMap: { [key: string]: string[] } = {};

SECTIONS.forEach((section) => {
  const priorityKey = `${snakeCase(section)}_priority`;
  if (priorityKey in allPriorities) {
    priorityMap[snakeCase(section)] = allPriorities[priorityKey];
  } else {
    priorityMap[snakeCase(section)] = [];
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
