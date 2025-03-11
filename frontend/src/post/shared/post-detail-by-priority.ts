import { ISectionKey } from "post/db";
import { POST_DETAILS_PRIORITY } from "post/db/renders";

const postDetailByPriority = (data: Record<string, any>, section: ISectionKey) => {
  const result: Record<string, any> = {};
  const priorityKeys = POST_DETAILS_PRIORITY[section];
  // Convert array to Set for O(1) lookups during recursion.
  const priorityKeySet = new Set(priorityKeys);

  const getNestedValue = (obj: any, keys: string[]): any => {
    for (const key of keys) {
      if (obj == null) return undefined;
      obj = obj[key];
    }
    return obj;
  };

  const deleteNestedValue = (obj: any, keys: string[]): void => {
    if (keys.length === 1) {
      delete obj[keys[0]];
    } else {
      const [firstKey, ...restKeys] = keys;
      if (obj[firstKey]) {
        deleteNestedValue(obj[firstKey], restKeys);
        if (Object.keys(obj[firstKey]).length === 0) {
          delete obj[firstKey];
        }
      }
    }
  };

  // Process the priority keys first.
  for (const key of priorityKeys) {
    const keys = key.split(".");
    const value = getNestedValue(data, keys);
    if (value !== undefined) {
      result[key] = value;
      deleteNestedValue(data, keys);
    }
  }

  // Recursively add the remaining keys.
  const addRemainingKeys = (source: any, target: any, prefix = "") => {
    for (const [key, value] of Object.entries(source)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!priorityKeySet.has(fullKey)) {
        target[key] =
          typeof value === "object" && value !== null && !Array.isArray(value)
            ? {}
            : value;
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          addRemainingKeys(value, target[key], fullKey);
        }
      }
    }
  };

  addRemainingKeys(data, result);
  return result;
};

export default postDetailByPriority;
