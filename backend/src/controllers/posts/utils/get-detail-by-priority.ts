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
  // Direct lookup using dot notation.
  if (_.has(orderedResult, intactKey)) {
    const parts = intactKey.split(".");
    return {
      parent: _.get(orderedResult, intactKey),
      container: orderedResult,
      key: parts[parts.length - 1],
    };
  }

  // Otherwise, scan the top-level keys.
  for (const topKey in orderedResult) {
    if (intactKey.startsWith(topKey + ".")) {
      // Remainder of the path.
      const remainder = intactKey.slice(topKey.length + 1); // +1 to skip the dot
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
 * Insert dynamic fields into the ordered result.
 *
 * For each dynamic key (e.g. "result_ref_1_name_of_the_post_1_cool_1"), we:
 *   1. Split the key by "_1_" into segments.
 *   2. Consider the intact parent as all segments except the last.
 *   3. Use findParent() to locate that parent.
 *   4. If the parent is found:
 *       - If its value is an object, insert the dynamic property inside it.
 *       - If not, add a sibling key (using the parent's key concatenated with "_" and the dynamic property).
 *   5. If no parent is found (even after dropping segments), then insert the dynamic key at the top level.
 */
const insertDynamicFields = (
  orderedResult: Record<string, any>,
  dynamicField: Map<string, string>
): Record<string, any> => {
  for (const [dynKey, dynValue] of dynamicField.entries()) {
    // Ensure key and value are strings.
    if (typeof dynKey !== "string" || typeof dynValue !== "string") continue;

    // Split using '_1_' as a delimiter.
    const segments = dynKey.split("_1_").filter(Boolean);
    if (segments.length < 2) {
      orderedResult[dynKey] = dynValue;
      continue;
    }
    // The dynamic property to add is the last segment.
    const dynamicProp = segments[segments.length - 1];

    // Build the intact parent key (all segments except the last).
    const intactKey = segments.slice(0, segments.length - 1).join(".");

    // First, try a direct lookup or nested search.
    const found = findParent(orderedResult, intactKey);

    if (found) {
      const { parent, container, key } = found;
      if (
        parent !== null &&
        typeof parent === "object" &&
        !Array.isArray(parent)
      ) {
        // If the parent is an object, insert directly inside it.
        parent[dynamicProp] = dynValue;
      } else {
        // The intact key exists but its value is not an object.
        // Insert as a sibling key next to the intact key.
        // Here, we build the sibling key name as "<intactKey>_<dynamicProp>"
        // For nested cases, container holds the object and key is the last segment.
        if (container && typeof container === "object") {
          container[`${key}_${dynamicProp}`] = dynValue;
        } else {
          // Fallback to top level if container is not an object.
          orderedResult[`${intactKey}_${dynamicProp}`] = dynValue;
        }
      }
    } else {
      // If no intact key is found, try dropping segments from the right.
      let segmentsCopy = segments.slice(0, segments.length - 1);
      let inserted = false;
      while (segmentsCopy.length > 0 && !inserted) {
        const candidateKey = segmentsCopy.join(".");
        const candidate = findParent(orderedResult, candidateKey);
        if (candidate) {
          const { parent, container, key } = candidate;
          if (
            parent !== null &&
            typeof parent === "object" &&
            !Array.isArray(parent)
          ) {
            parent[dynamicProp] = dynValue;
          } else {
            if (container && typeof container === "object") {
              container[`${key}_${dynamicProp}`] = dynValue;
            } else {
              orderedResult[`${candidateKey}_${dynamicProp}`] = dynValue;
            }
          }
          inserted = true;
        } else {
          segmentsCopy.pop();
        }
      }
      // If still not inserted, add at top level.
      if (!inserted) {
        orderedResult[dynKey] = dynValue;
      }
    }
  }
  return orderedResult;
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

  let finalResult = { ...orderedResult, ...data };

  // Insert dynamic keys according to your rule.
  if (dynamicField && dynamicField instanceof Map) {
    finalResult = insertDynamicFields(finalResult, dynamicField);
  }

  console.log(finalResult);
  // Finally, merge any remaining keys from data.
  return finalResult;
};
export default postDetailByPriority;
