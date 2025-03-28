import {
  EXCLUDED_KEYS,
  ISectionKey,
  POST_DETAILS_PRIORITY,
} from "@models/posts/db";
import _ from "lodash";
import { formattedDateRefView } from "./calculate-date";

const flatten = (
  obj: Record<string, any>,
  prefix = ""
): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    let value = obj[key];

    // If the value is a Date, assign it directly (or convert to string)
    if (value instanceof Date) {
      acc[fullKey] = value.toISOString(); // or just `value` if you prefer
      return acc;
    }

    // If the value is a Buffer, convert it to a string.
    if (Buffer.isBuffer(value)) {
      acc[fullKey] = value.toString();
      return acc;
    }

    // If the value is a MongoDB ObjectId, convert it to its hex string.
    if (value && typeof value.toHexString === "function") {
      acc[fullKey] = value.toHexString();
      return acc;
    }

    // Continue with standard flattening if it's an object (and not an array)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flatten(value, fullKey));
    } else {
      acc[fullKey] = value;
    }
    return acc;
  }, {});
};

//getting the updatedAt while looking up the whole data recent most date
const flattenAndPreserveUpdatedAt = (
  obj: Record<string, any>
): Record<string, any> => {
  const flatObj = flatten(obj);
  let latestDate: Date | null = null as Date | null;

  // Look up keys that end with 'createdAt' or 'updatedAt' recent
  Object.keys(flatObj).forEach((key) => {
    if (key.endsWith("createdAt") || key.endsWith("updatedAt")) {
      const date = new Date(flatObj[key]);
      if (!isNaN(date.getTime())) {
        if (latestDate === null || date > latestDate) {
          latestDate = date;
        }
      }
    }
  });

  if (latestDate) {
    flatObj.last_updated = latestDate.toISOString();
  }

  // Remove other keys that end with 'createdAt' or 'updatedAt' (except the one we just set)
  Object.keys(flatObj).forEach((key) => {
    if (
      (key.endsWith("createdAt") || key.endsWith("updatedAt")) &&
      key !== "last_updated"
    ) {
      delete flatObj[key];
      _.unset(obj, key); //deleting from the data (so that it's won't add up at the end)
    }
  });

  return flatObj;
};

/**
 * Recursively inserts a dynamic field into the given object.
 *
 * @param obj The object in which to insert.
 * @param parts The remaining segments of the target key.
 * @param dynKey The original dynamic key.
 * @param dynValue The dynamic value to insert.
 * @returns true if insertion occurred.
 */
const recursiveInsert = (
  obj: any,
  parts: string[],
  dynKey: string,
  dynValue: string
): boolean => {
  if (!parts.length) {
    // No remaining parts: insert here.
    obj[dynKey] = dynValue;
    return true;
  }
  const first = parts[0];
  if (obj.hasOwnProperty(first)) {
    // If the property exists and is an object, keep traversing.
    if (typeof obj[first] === "object" && obj[first] !== null) {
      return recursiveInsert(obj[first], parts.slice(1), dynKey, dynValue);
    } else {
      // Found the segment but it isn't an object; insert here as a sibling.
      obj[dynKey] = dynValue;
      return true;
    }
  } else {
    // If the property doesn't exist, insert dynamic field here.
    obj[dynKey] = dynValue;
    return true;
  }
};

/**
 * Attempts to insert the dynamic field into a nested object by searching for the longest
 * matching top‑level key prefix. The normalized target key (dot notation) is split into parts.
 *
 * For example, for "result_ref.result.current_year.cool_2", if the top‑level key
 * "result_ref.result" exists, then the remaining parts ["current_year", "cool_2"] are used to
 * recursively insert into that object.
 *
 * @param finalResult The final result object.
 * @param targetKey The normalized target key in dot notation.
 * @param dynKey The original dynamic key.
 * @param dynValue The dynamic field's value.
 * @returns true if insertion occurred.
 */
const candidateInsert = (
  finalResult: Record<string, any>,
  targetKey: string,
  dynKey: string,
  dynValue: string
): boolean => {
  const parts = targetKey.split(".");
  // Try from the full chain down to 1 segment.
  for (let j = parts.length; j >= 1; j--) {
    const prefix = parts.slice(0, j).join(".");
    if (finalResult.hasOwnProperty(prefix)) {
      const candidate = finalResult[prefix];
      if (typeof candidate !== "object" || candidate === null) {
        // Not an object: cannot insert inside.
        return false;
      }
      // Use the remaining parts for recursive insertion.
      const remainingParts = parts.slice(j);
      return recursiveInsert(candidate, remainingParts, dynKey, dynValue);
    }
  }
  return false;
};

/**
 * Inserts dynamic fields into finalResult such that:
 * - For direct matches: the dynamic field’s target key is derived by removing the last segment.
 *   - If an exact top-level key is found:
 *      a. If its value is an object, insert the dynamic field inside that object.
 *      b. Otherwise, insert the dynamic field as the immediate sibling.
 * - If an exact key isn’t found, a candidate search is performed on the nested structure.
 * - If no candidate is found, the dynamic field is appended at the end.
 */
const insertDynamicFields = (
  finalResult: Record<string, any>,
  dynamicField: Map<string, string>
): Record<string, any> => {
  // Build mapping: for each dynamic key, drop the last segment (if there are more than one) to create a target key.
  const dynamicMapping = Array.from(dynamicField.entries()).map(([dynKey, dynValue]) => {
    const parts = dynKey.split("_1_").filter((p) => p);
    // If more than one segment exists, drop the last one for a direct match.
    const targetKey = parts.length > 1 ? parts.slice(0, -1).join(".") : parts.join(".");
    return { dynKey, dynValue, targetKey };
  });

  // Convert finalResult into an ordered array of entries.
  const orderedEntries = Object.entries(finalResult);
  const newOrderedEntries: [string, any][] = [];
  const inserted = new Set<string>();

  // Process exact top-level matches using index iteration.
  for (let i = 0; i < orderedEntries.length; i++) {
    const [key, value] = orderedEntries[i];
    newOrderedEntries.push([key, value]);
    // Look for dynamic fields that exactly target this key.
    const matches = dynamicMapping.filter((dm) => dm.targetKey === key);
    for (const dm of matches) {
      if (inserted.has(dm.dynKey)) continue; // already processed
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // If value is an object, insert the dynamic field inside.
        value[dm.dynKey] = dm.dynValue;
        inserted.add(dm.dynKey);
      } else {
        // Otherwise, insert as immediate sibling (right after the key).
        newOrderedEntries.push([dm.dynKey, dm.dynValue]);
        inserted.add(dm.dynKey);
      }
    }
  }

  // Rebuild newFinalResult from ordered entries.
  let newFinalResult: Record<string, any> = {};
  for (const [k, v] of newOrderedEntries) {
    newFinalResult[k] = v;
  }

  // Process dynamic fields that weren't inserted at the top level.
  for (const dm of dynamicMapping) {
    if (inserted.has(dm.dynKey)) continue;
    if (candidateInsert(newFinalResult, dm.targetKey, dm.dynKey, dm.dynValue)) {
      inserted.add(dm.dynKey);
    } else {
      // If still not inserted, append at the end.
      newFinalResult[dm.dynKey] = dm.dynValue;
      inserted.add(dm.dynKey);
    }
  }

  return newFinalResult;
};

const postDetailByPriority = (
  data: Record<string, any>,
  section: ISectionKey,
  dynamicField?: Map<string, string>
): Record<string, any> => {
  const priorityKeys = POST_DETAILS_PRIORITY[section];
  const flatData = flattenAndPreserveUpdatedAt(data);
  const orderedResult: Record<string, any> = {};

  for (const key of priorityKeys) {
    const flatValue = flatData[key];
    const nestedValue = _.get(data, key);
    let value =
      flatValue !== undefined
        ? flatValue
        : nestedValue !== undefined
        ? nestedValue
        : "";
    if (key === "date_ref" && typeof value === "object" && value !== null) {
      value = formattedDateRefView(value);
    }
    orderedResult[key] = value;
    _.unset(data, key);
  }

  let finalResult: Record<string, any> = { ...orderedResult, ...data };
  finalResult = filterFinalResult(finalResult);

  // Process dynamic fields if provided.
  if (dynamicField) {
    finalResult = insertDynamicFields(finalResult, dynamicField);
  }

  console.log(finalResult, dynamicField);
  return finalResult;
};

export default postDetailByPriority;



const filterFinalResult = (data: Record<string, any>): Record<string, any> => {
  // Filter out unwanted entries
  const filteredEntries = Object.entries(data).filter(([key, value]) => {
    return !(
      EXCLUDED_KEYS[key] || // Exclude predefined keys
      value === null ||
      value === "" ||
      value === undefined ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "object" &&
        Object.keys(value).length === 1 &&
        "_id" in value) ||
      (typeof value === "object" &&
        Object.keys(value).length === 4 &&
        "_id" in value &&
        "createdAt" in value &&
        "updatedAt" in value &&
        "__v" in value)
    );
  });

  // Convert back to an object
  return Object.fromEntries(filteredEntries);
};
