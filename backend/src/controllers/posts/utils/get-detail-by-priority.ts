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

const insertDynamicFields = (
  orderedResult: Record<string, any>,
  dynamicField: Map<string, string>
): Record<string, Array<{ key: string; value: string }>> => {
  const immediateSiblingMapping: Record<
    string,
    Array<{ key: string; value: string }>
  > = {};

  for (const [dynKey, dynValue] of dynamicField.entries()) {
    if (typeof dynKey !== "string" || typeof dynValue !== "string") continue;
    const segments = dynKey.split("_1_").filter(Boolean);
    if (segments.length < 2) {
      // Skip keys that don't match the expected pattern.
      continue;
    }
    // Build the intact key from all segments except the last.
    const intactKey = segments.slice(0, segments.length - 1).join(".");
    // This is the immediate sibling key we want.
    const immediateSiblingKey = intactKey;
    // dynamicProp is available if needed but we now preserve the full dynKey.
    const dynamicProp = segments[segments.length - 1];

    // First try the direct intact key.
    const found = findParent(orderedResult, intactKey);
    if (found) {
      const { parent, container } = found;
      if (
        parent !== null &&
        typeof parent === "object" &&
        !Array.isArray(parent)
      ) {
        parent[dynKey] = dynValue;
        // Record as immediate sibling unless the key is link_ref or date_ref.
        if (immediateSiblingKey !== "link_ref" && immediateSiblingKey !== "date_ref") {
          immediateSiblingMapping[immediateSiblingKey] =
            immediateSiblingMapping[immediateSiblingKey] || [];
          immediateSiblingMapping[immediateSiblingKey].push({
            key: dynKey,
            value: dynValue,
          });
        }
      } else if (
        container !== null &&
        typeof container === "object" &&
        !Array.isArray(container)
      ) {
        container[dynKey] = dynValue;
        if (immediateSiblingKey !== "link_ref" && immediateSiblingKey !== "date_ref") {
          immediateSiblingMapping[immediateSiblingKey] =
            immediateSiblingMapping[immediateSiblingKey] || [];
          immediateSiblingMapping[immediateSiblingKey].push({
            key: dynKey,
            value: dynValue,
          });
        }
      } else {
        if (immediateSiblingKey !== "link_ref" && immediateSiblingKey !== "date_ref") {
          immediateSiblingMapping[immediateSiblingKey] =
            immediateSiblingMapping[immediateSiblingKey] || [];
          immediateSiblingMapping[immediateSiblingKey].push({ key: dynKey, value: dynValue });
        }
      }
      continue;
    }

    // If not found, try splitting by combining the first i segments as intact keys.
    let inserted = false;
    // i represents the count of segments to use for candidate intact key.
    for (let i = segments.length - 1; i > 0 && !inserted; i--) {
      const candidateKey = segments.slice(0, i).join(".");
      const remainderPath = segments.slice(i).join(".");
      const candidate = findParent(orderedResult, candidateKey);
      if (candidate) {
        const { parent } = candidate;
        if (
          parent !== null &&
          typeof parent === "object" &&
          !Array.isArray(parent)
        ) {
          // Try to get the nested value using the remainder path.
          const nested = _.get(parent, remainderPath);
          if (
            nested !== undefined &&
            nested !== null &&
            typeof nested === "object" &&
            !Array.isArray(nested)
          ) {
            nested[dynKey] = dynValue;
            if (candidateKey !== "link_ref" && candidateKey !== "date_ref") {
              immediateSiblingMapping[candidateKey] =
                immediateSiblingMapping[candidateKey] || [];
              immediateSiblingMapping[candidateKey].push({
                key: dynKey,
                value: dynValue,
              });
            }
          } else {
            // If no nested key (or it's not an object), skip insertion.
          }
          inserted = true;
          break;
        } else {
          if (candidateKey !== "link_ref" && candidateKey !== "date_ref") {
            immediateSiblingMapping[candidateKey] =
              immediateSiblingMapping[candidateKey] || [];
            immediateSiblingMapping[candidateKey].push({
              key: dynKey,
              value: dynValue,
            });
          }
          inserted = true;
          break;
        }
      }
    }
    // If still not inserted, skip it.
  }
  return immediateSiblingMapping;
};

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
  // Do not append any remaining dynamic fields.
  return newOrdered;
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

  if (dynamicField && dynamicField instanceof Map) {
    const immediateSiblingMapping = insertDynamicFields(finalResult, dynamicField);
    finalResult = reorderDynamicFields(finalResult, immediateSiblingMapping);
  }

  finalResult = filterFinalResult(finalResult);

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
