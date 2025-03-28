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
 * Inserts dynamic fields into finalResult such that if an exact target key is found:
 * - When the value is an object, the dynamic key is inserted inside it.
 * - Otherwise, the dynamic key–value pair is inserted immediately after the matched key.
 *
 * If the exact key isn’t found, it tries to remove segments from the target key (using dot notation)
 * until a match is found. In that case, if the parent value is an object, the dynamic key is added there;
 * otherwise, it is inserted immediately after the parent key.
 */
const insertDynamicFields = (
  finalResult: Record<string, any>,
  dynamicField: Map<string, string>
): Record<string, any> => {
  // Build a mapping for each dynamic field:
  // Remove the trailing _1_ parts and join with dot notation.
  const dynamicMapping = Array.from(dynamicField.entries()).map(
    ([dynKey, dynValue]) => {
      // Split by the literal '_1_' and filter out any empty strings.
      const parts = dynKey.split('_1_').filter((p) => p);
      const targetKey = parts.join(".");
      return { dynKey, dynValue, targetKey };
    }
  );

  // Convert finalResult into an ordered array of entries.
  const orderedEntries = Object.entries(finalResult);
  // This will be our new ordered result.
  const newOrderedEntries: [string, any][] = [];

  // Keep track of dynamic fields that got inserted.
  const inserted = new Set<string>();

  // Helper to insert as immediate sibling based on a parent key.
  const insertAfterKey = (keyToMatch: string, dm: { dynKey: string; dynValue: string }) => {
    // Find the index of keyToMatch in newOrderedEntries.
    const idx = newOrderedEntries.findIndex(([k]) => k === keyToMatch);
    if (idx >= 0) {
      newOrderedEntries.splice(idx + 1, 0, [dm.dynKey, dm.dynValue]);
      inserted.add(dm.dynKey);
    } else {
      // Fallback: add at the end.
      newOrderedEntries.push([dm.dynKey, dm.dynValue]);
      inserted.add(dm.dynKey);
    }
  };

  // Walk through each key in the current order.
  for (const [key, value] of orderedEntries) {
    newOrderedEntries.push([key, value]);

    // Check for any dynamic field that exactly targets this key.
    const matches = dynamicMapping.filter((dm) => dm.targetKey === key);
    for (const dm of matches) {
      if (inserted.has(dm.dynKey)) continue; // already processed

      // If the current value is an object, add dynamic key inside it.
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        value[dm.dynKey] = dm.dynValue;
        inserted.add(dm.dynKey);
      } else {
        // Otherwise, insert it as the immediate sibling.
        newOrderedEntries.push([dm.dynKey, dm.dynValue]);
        inserted.add(dm.dynKey);
      }
    }
  }

  // For any dynamic fields not matched by exact key,
  // try finding a parent key by trimming the target key.
  for (const dm of dynamicMapping) {
    if (inserted.has(dm.dynKey)) continue; // already handled
    const parts = dm.targetKey.split(".");
    while (parts.length > 1) {
      parts.pop();
      const parentKey = parts.join(".");
      // Check if parentKey exists at the top level.
      if (orderedEntries.some(([k]) => k === parentKey)) {
        // Found a parent key.
        const parentVal = finalResult[parentKey];
        if (typeof parentVal === "object" && parentVal !== null && !Array.isArray(parentVal)) {
          // Insert into the parent object.
          parentVal[dm.dynKey] = dm.dynValue;
          inserted.add(dm.dynKey);
        } else {
          // Otherwise, insert as the immediate sibling of the parent.
          insertAfterKey(parentKey, dm);
        }
        break; // stop trying further
      }
    }
    // If no parent key is found, you could choose to leave it out or add at top-level.
    if (!inserted.has(dm.dynKey)) {
      newOrderedEntries.push([dm.dynKey, dm.dynValue]);
      inserted.add(dm.dynKey);
    }
  }

  // Reconstruct the object preserving the order.
  const newFinalResult: Record<string, any> = {};
  for (const [k, v] of newOrderedEntries) {
    newFinalResult[k] = v;
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
