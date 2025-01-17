import SECTIONS from "db/postDb/sections.json";
import { IPostDetail } from "models/postModels/IPost";

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
  const getNestedValue = (obj: any, key: string) => {
    // Check if the key exists and the object is not null or undefined
    if (obj && typeof obj === "object" && key in obj) {
      return obj[key];
    }
    return undefined;
  };
  priorityKeys.forEach((key) => {
    const keys = key.split(".");
    let value = getNestedValue(data, key);
    // console.log(value)
    // keys.forEach((subKey) => {
    //   value = value ? value[subKey] : undefined;
    // });
    if (value !== undefined) {
      result[key] = value;
      delete data[key as keyof IPostDetail];
      
      // let currentData: any = data;
      // keys.forEach((subKey, index) => {
      //   if (index === keys.length - 1) {
      //     delete currentData[subKey];
      //   } else {
      //     currentData = currentData[subKey];
      //   }
      // });
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
