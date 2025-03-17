import { ISectionKey, POST_DETAILS_PRIORITY } from "@models/posts/db";
import _ from "lodash";

// Utility: Flattens a nested object into a dot-notation key map.
const flatten = (
  obj: Record<string, any>,
  prefix = ""
): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});
};

// Reorder the response data based on the priority keys without deleting any keys.
const postDetailByPriority = (
  data: Record<string, any>,
  section: ISectionKey
) => {
  const priorityKeys = POST_DETAILS_PRIORITY[section];
  const flatData = flatten(data);

  // Create a new flat object for ordered keys.
  const orderedFlat: Record<string, any> = {};
  // First, add keys from the priority list (if present in the data).
  for (const key of priorityKeys) {
    if (key.includes(".")) {
      orderedFlat[key] = flatData[key];
    } else {
      orderedFlat[key] = data[key];
    }
    _.unset(data, key);
  }

  // Reconstruct the nested object.
  return { ...orderedFlat, ...data };
};

export default postDetailByPriority;
