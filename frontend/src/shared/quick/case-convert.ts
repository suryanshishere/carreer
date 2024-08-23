export const convertToSnakeCase = (str: string): string => {
  // Replace spaces, hyphens, or other delimiters with underscores
  const withUnderscores = str
    .replace(/[\s\-]+/g, '_') // Replace spaces and hyphens with underscores
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Handle camel case and Pascal case
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Handle cases like "HTTPResponse" -> "HTTP_Response"
    .toLowerCase(); // Convert everything to lower case
  
  // Ensure the string does not start with an underscore
  return withUnderscores.startsWith('_') ? withUnderscores.slice(1) : withUnderscores;
};