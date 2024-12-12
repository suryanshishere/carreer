import SECTIONS from "db/postDb/sections.json";
import { IPostDetail } from "models/postModels/IPostDetail";

export const priorityMapping = (priorities: {
  [key: string]: string[];
}): { [key: string]: string[] } => {
  const priorityMap: { [key: string]: string[] } = {};

  SECTIONS.forEach((section) => {
    const priorityKey = `${section}_priority`;
    if (priorityKey in priorities) {
      priorityMap[section] = priorities[priorityKey];
    } else {
      priorityMap[section] = [];
    }
  });

  return priorityMap;
};

const rearrangeObjectByPriority = (
  data: IPostDetail,
  priorityKeys: string[]
) => {
  let result: { [key: string]: any } = {};

  priorityKeys.forEach((key) => {
    const keys = key.split(".");
    let value: any = data;
    keys.forEach((subKey) => {
      value = value ? value[subKey] : undefined;
    });
    if (value !== undefined) {
      result[keys[keys.length - 1]] = value;

      let currentData: any = data;
      keys.forEach((subKey, index) => {
        if (index === keys.length - 1) {
          delete currentData[subKey];
        } else {
          currentData = currentData[subKey];
        }
      });
    }
  });

  Object.keys(data).forEach((key) => {
    if (!priorityKeys.includes(key)) {
      result[key] = data[key as keyof IPostDetail];
    }
  });

  return result;
};

export default rearrangeObjectByPriority;
