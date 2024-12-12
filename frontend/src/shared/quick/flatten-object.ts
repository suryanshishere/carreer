import _ from "lodash";

//removing 
function flattenToLastKeys(
  obj: Record<string, any>,
  leaveKeys: string[] = []
): Record<string, any> {
  const result: Record<string, any> = {};

  const flattenHelper = (nestedObj: Record<string, any>, parentKey = '') => {
    Object.keys(nestedObj).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // If the key is in the leaveKeys list, retain its structure (don't flatten it)
      if (leaveKeys.includes(key) && typeof nestedObj[key] === "object" && nestedObj[key] !== null) {
        result[fullKey] = nestedObj[key]; // Keep the key as an object
      } else if (
        typeof nestedObj[key] === "object" &&
        nestedObj[key] !== null &&
        !Array.isArray(nestedObj[key])
      ) {
        // If the key is part of a nested object, flatten it but keep only the last part of the key path
        flattenHelper(nestedObj[key], fullKey);
      } else {
        // Assign last-level key-value pair (flatten other non-object keys)
        result[fullKey] = nestedObj[key];
      }
    });
  };

  flattenHelper(obj);
  
  // Remove any nested keys where the last part is not required (like "important_links")
  const finalResult: Record<string, any> = {};

  Object.keys(result).forEach((key) => {
    const lastPart = key.split('.').pop(); // Get the last part of the key path
    finalResult[lastPart!] = result[key]; // Only use the last part as the key
  });

  return finalResult;
}

export default flattenToLastKeys;
