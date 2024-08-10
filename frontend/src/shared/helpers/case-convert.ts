export const camelToSnake = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();