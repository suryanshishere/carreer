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

const postDetailByPriority = (
  data: Record<string, any>,
  section: ISectionKey,
  dynamicField?: Map<string, string>
) => {
  const priorityKeys = POST_DETAILS_PRIORITY[section];
  const flatData = flattenAndPreserveUpdatedAt(data);
  const orderedResult: Record<string, any> = {};

  // Process priority keys from flatData/nested data.
  for (const key of priorityKeys) {
    const flatValue = flatData[key];
    const nestedValue = _.get(data, key);
    let value =
      flatValue !== undefined
        ? flatValue
        : nestedValue !== undefined
        ? nestedValue
        : "";

    // Correctly format the dates view.
    if (key === "date_ref" && typeof value === "object" && value !== null) {
      value = formattedDateRefView(value);
    }

    orderedResult[key] = value;
    _.unset(data, key);
  }

  // Prepare dynamic field grouping:
  // Group by a base key (all segments except the last) using dot notation for lookup,
  // but keep the original _1_ notation for final output.
  const dynamicFieldsByBase: Record<string, Record<string, string>> = {};
  const originalKeysMap: Record<string, string> = {};

  if (dynamicField) {
    for (const [dKey, dValue] of dynamicField.entries()) {
      // Convert _1_ notation to dot notation for lookup.
      const dotKey = dKey.replace(/_1_/g, ".");
      const parts = dotKey.split(".");
      if (parts.length < 2) continue;
      const baseKey = parts.slice(0, parts.length - 1).join(".");
      if (!dynamicFieldsByBase[baseKey]) {
        dynamicFieldsByBase[baseKey] = {};
      }
      originalKeysMap[dotKey] = dKey;
      dynamicFieldsByBase[baseKey][dotKey] = dValue;
    }
  }

  // Build final result by iterating over each priority key.
  const finalResult: Record<string, any> = {};
  for (const pKey of priorityKeys) {
    if (pKey in orderedResult) {
      finalResult[pKey] = orderedResult[pKey];

      // (A) Merge dynamic fields whose base key exactly matches pKey.
      if (dynamicFieldsByBase[pKey]) {
        for (const dynDotKey in dynamicFieldsByBase[pKey]) {
          const originalKey = originalKeysMap[dynDotKey] || dynDotKey;
          const displayKey = originalKey.split(/\.|_1_/).pop() || originalKey;
          if (
            typeof finalResult[pKey] === "object" &&
            finalResult[pKey] !== null
          ) {
            _.set(
              finalResult[pKey],
              displayKey,
              dynamicFieldsByBase[pKey][dynDotKey]
            );
          } else {
            finalResult[originalKey] = dynamicFieldsByBase[pKey][dynDotKey];
          }
        }
      }

      // (B) Merge dynamic fields whose base key starts with pKey + "."
      // i.e. nested dynamic fields.
      for (const baseKey in dynamicFieldsByBase) {
        if (baseKey.startsWith(pKey + ".") && baseKey !== pKey) {
          // Compute the nested path relative to pKey.
          const nestedPath = baseKey.substring(pKey.length + 1); // skip the dot
          for (const dynDotKey in dynamicFieldsByBase[baseKey]) {
            const originalKey = originalKeysMap[dynDotKey] || dynDotKey;
            const displayKey = originalKey.split(/\.|_1_/).pop() || originalKey;
            if (
              typeof finalResult[pKey] === "object" &&
              finalResult[pKey] !== null
            ) {
              _.set(
                finalResult[pKey],
                `${nestedPath}.${displayKey}`,
                dynamicFieldsByBase[baseKey][dynDotKey]
              );
            }
          }
        }
      }
    }
  }

  // Merge any remaining keys from orderedResult that weren't in the priority.
  for (const key in orderedResult) {
    if (!(key in finalResult)) {
      finalResult[key] = orderedResult[key];
    }
  }

  console.log(dynamicField, data, finalResult);

  // Finally, merge any remaining keys from data.
  return { ...finalResult, ...data };
};
export default postDetailByPriority;
