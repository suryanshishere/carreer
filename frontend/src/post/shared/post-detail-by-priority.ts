 
const postDetailByPriority = (
  data: Record<string, any>,
  priorityKeys: string[]
) => {
  const result: Record<string, any> = {};

  const getNestedValue = (obj: any, keys: string[]): any =>
    keys.reduce((acc, key) => acc?.[key], obj);

  const deleteNestedValue = (obj: any, keys: string[]): void => {
    if (keys.length === 1) {
      delete obj[keys[0]];
    } else {
      const [firstKey, ...restKeys] = keys;
      if (obj[firstKey]) {
        deleteNestedValue(obj[firstKey], restKeys);
        if (Object.keys(obj[firstKey]).length === 0) delete obj[firstKey];
      }
    }
  };

  priorityKeys.forEach((key) => {
    const keys = key.split(".");
    const value = getNestedValue(data, keys);
    if (value !== undefined) {
      result[key] = value;
      deleteNestedValue(data, keys);
    }
  });

  const addRemainingKeys = (source: any, target: any, prefix = "") => {
    Object.entries(source).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!priorityKeys.includes(fullKey)) {
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
    });
  };

  addRemainingKeys(data, result);
  return result;
};

export default postDetailByPriority;
