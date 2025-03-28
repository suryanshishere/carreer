import { ISectionKey, POST_DETAILS_PRIORITY } from "@models/posts/db";
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
 * Attempts to find the parent value given an intact key.
 *
 * First, it tries a direct lookup in orderedResult. If not found, it then scans
 * the top-level keys for one that is a prefix of the intact key and uses the remainder
 * to retrieve the nested value.
 *
 * @param orderedResult The final result object.
 * @param intactKey The intact key built from the dynamic key segments (e.g. "result_ref.result.current_year").
 *
 * @returns An object with:
 *    - parent: the value found (could be object or other type),
 *    - container: the object that directly holds the property (if found via nesting),
 *    - key: the property name within the container.
 *
 * If nothing is found, returns null.
 */
const findParent = (
  orderedResult: Record<string, any>,
  intactKey: string
): { parent: any; container: any; key: string } | null => {
  if (_.has(orderedResult, intactKey)) {
    const parts = intactKey.split(".");
    return {
      parent: _.get(orderedResult, intactKey),
      container: orderedResult,
      key: parts[parts.length - 1],
    };
  }
  for (const topKey in orderedResult) {
    if (intactKey.startsWith(topKey + ".")) {
      const remainder = intactKey.slice(topKey.length + 1);
      const candidate = _.get(orderedResult[topKey], remainder);
      if (candidate !== undefined) {
        const remParts = remainder.split(".");
        return {
          parent: candidate,
          container: _.get(orderedResult, topKey),
          key: remParts[remParts.length - 1],
        };
      }
    }
  }
  return null;
};

/**
 * Inserts dynamic fields into the final object.
 *
 * For each dynamic key (e.g. "result_ref_1_result_1_current_year_1_cool_2"):
 * 1. Split the key into segments using "_1_" and compute:
 *    - intactParent: all segments except the last joined by "."
 *    - dynamicProp: the last segment.
 * 2. Use findParent() to locate intactParent.
 *    - If found and the parent's value is an object, insert inside that object:
 *         parent[dynamicProp] = dynValue.
 *    - Otherwise, record this dynamic field (keeping its original key) for immediate-sibling insertion.
 * 3. If no parent is found (even after dropping segments), add the dynamic field at the top level.
 *
 * Returns an object mapping parent keys to an array of dynamic entries that need
 * to be inserted as immediate siblings.
 */
const insertDynamicFields = (
  orderedResult: Record<string, any>,
  dynamicField: Map<string, string>
): Record<string, Array<{ key: string; value: string }>> => {
  const immediateSiblingMapping: Record<string, Array<{ key: string; value: string }>> = {};

  for (const [dynKey, dynValue] of dynamicField.entries()) {
    if (typeof dynKey !== "string" || typeof dynValue !== "string") continue;
    const segments = dynKey.split("_1_").filter(Boolean);
    if (segments.length < 2) {
      orderedResult[dynKey] = dynValue;
      continue;
    }
    const intactKey = segments.slice(0, segments.length - 1).join(".");
    const dynamicProp = segments[segments.length - 1];

    const found = findParent(orderedResult, intactKey);
    if (found) {
      const { parent, container, key } = found;
      if (parent !== null && typeof parent === "object" && !Array.isArray(parent)) {
        // Insert _inside_ the object using dynamicProp as the property name.
        parent[dynamicProp] = dynValue;
      } else {
        // Record for immediate sibling insertion.
        immediateSiblingMapping[intactKey] = immediateSiblingMapping[intactKey] || [];
        immediateSiblingMapping[intactKey].push({ key: dynKey, value: dynValue });
      }
    } else {
      // Try dropping segments one by one.
      let segmentsCopy = segments.slice(0, segments.length - 1);
      let inserted = false;
      while (segmentsCopy.length > 0 && !inserted) {
        const candidateKey = segmentsCopy.join(".");
        const candidate = findParent(orderedResult, candidateKey);
        if (candidate) {
          const { parent, container, key } = candidate;
          if (parent !== null && typeof parent === "object" && !Array.isArray(parent)) {
            parent[dynamicProp] = dynValue;
          } else {
            immediateSiblingMapping[candidateKey] = immediateSiblingMapping[candidateKey] || [];
            immediateSiblingMapping[candidateKey].push({ key: dynKey, value: dynValue });
          }
          inserted = true;
        } else {
          segmentsCopy.pop();
        }
      }
      if (!inserted) {
        // If still not inserted, add at top level.
        orderedResult[dynKey] = dynValue;
      }
    }
  }
  return immediateSiblingMapping;
};

/**
 * Reorders the top-level keys of orderedResult so that for each recorded dynamic field
 * (that was not inserted inside an object) the dynamic field appears immediately after
 * its intact parent key.
 */
const reorderDynamicFields = (
  orderedResult: Record<string, any>,
  immediateSiblingMapping: Record<string, Array<{ key: string; value: string }>>
): Record<string, any> => {
  const newOrdered: Record<string, any> = {};
  const keys = Object.keys(orderedResult);
  for (const key of keys) {
    newOrdered[key] = orderedResult[key];
    if (immediateSiblingMapping[key]) {
      for (const entry of immediateSiblingMapping[key]) {
        newOrdered[entry.key] = entry.value;
      }
      delete immediateSiblingMapping[key];
    }
  }
  // Append any remaining dynamic fields.
  Object.keys(immediateSiblingMapping).forEach((remainingKey) => {
    for (const entry of immediateSiblingMapping[remainingKey]) {
      newOrdered[entry.key] = entry.value;
    }
  });
  return newOrdered;
};

/**
 * Processes post details by priority:
 * 1. Flattens data and extracts priority keys.
 * 2. Merges any remaining data.
 * 3. Inserts dynamic fields (either inside object values if possible or recorded for immediate-sibling insertion).
 * 4. Reorders the final object so that immediate-sibling dynamic fields appear right after their parent's key.
 */
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

  // Merge any remaining keys from data.
  let finalResult: Record<string, any> = { ...orderedResult, ...data };

  // Process dynamic fields.
  if (dynamicField && dynamicField instanceof Map) {
    const immediateSiblingMapping = insertDynamicFields(finalResult, dynamicField);
    finalResult = reorderDynamicFields(finalResult, immediateSiblingMapping);
  }

  console.log(finalResult);
  return finalResult;
};

export default postDetailByPriority;