import  POST_DB  from "post/post-db";
import { IPostDetail } from "post/post-interfaces/postModels/IPost";

export const priorityMapping = (priorities: {
  [key: string]: string[];
}): { [key: string]: string[] } => {
  const priorityMap: { [key: string]: string[] } = {};

  POST_DB.sections.forEach((section) => {
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

  // Helper to recursively get nested value
  const getNestedValue = (obj: any, keys: string[]): any => {
    return keys.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
  };

  // Helper to recursively delete nested value
  const deleteNestedValue = (obj: any, keys: string[]): void => {
    if (keys.length === 1) {
      delete obj[keys[0]];
    } else {
      const [firstKey, ...restKeys] = keys;
      if (obj[firstKey]) {
        deleteNestedValue(obj[firstKey], restKeys);
        // Clean up empty objects
        if (Object.keys(obj[firstKey]).length === 0) {
          delete obj[firstKey];
        }
      }
    }
  };

  // Process priority keys
  priorityKeys.forEach((key) => {
    const keys = key.split(".");
    const value = getNestedValue(data, keys);
    if (value !== undefined) {
      result[key] = value;
      deleteNestedValue(data, keys);
    }
  });

  // Add remaining keys
  const addRemainingKeys = (source: any, target: any, prefix = "") => {
    Object.keys(source).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!priorityKeys.includes(fullKey)) {
        if (
          typeof source[key] === "object" &&
          !Array.isArray(source[key]) &&
          source[key] !== null
        ) {
          target[key] = {};
          addRemainingKeys(source[key], target[key]);
        } else {
          target[key] = source[key];
        }
      }
    });
  };

  addRemainingKeys(data, result);

  return result;
};

export default rearrangeObjectByPriority;
