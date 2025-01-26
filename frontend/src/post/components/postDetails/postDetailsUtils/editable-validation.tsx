import { POST_LIMITS_DB } from "db/post-db";

const {
  short_char_limit,
  long_char_limit,
  non_negative_num,
  rank_minute_num,
  age_num,
  limit_keys_division,
} = POST_LIMITS_DB;

//this will be helpfull all across the app
export const getFieldValidation = (fieldName: string) => {
  const fieldType = Object.entries(limit_keys_division).find(([_, values]) =>
    values.includes(fieldName)
  )?.[0];

  switch (fieldType) {
    case "date_keys":
      return {type: "date"}
    case "dropdown_keys":
      return { type: "dropdown" };
    case "long_char_keys":
      return {
        min: long_char_limit.min,
        max: long_char_limit.max,
      };
    case "medium_char_keys":
    case "short_char_keys":
      return {
        min: short_char_limit.min,
        max: short_char_limit.max,
      };
    case "non_negative_num_keys":
      return {
        min: non_negative_num.min,
        max: non_negative_num.max,
      };
    case "rank_minute_num_keys":
      return {
        min: rank_minute_num.min,
        max: rank_minute_num.max,
      };
    case "age_num_keys":
      return {
        min: age_num.min,
        max: age_num.max,
      };
    default:
      return null;
  }
};

export const validateFieldValue = (
  value: string | number,
  validationConfig: ReturnType<typeof getFieldValidation>
) => {
  if (!validationConfig) return { isValid: true, error: undefined };

  if (validationConfig.type === "dropdown") {
    return { isValid: true, error: undefined };
  }

  if (typeof value === "string") {
    const length = value.length;
    if (length < validationConfig.min! || length > validationConfig.max!) {
      return {
        isValid: false,
        error: `Must be between ${validationConfig.min} and ${validationConfig.max} characters`,
      };
    }
  }

  if (typeof value === "number") {
    if (value < validationConfig.min! || value > validationConfig.max!) {
      return {
        isValid: false,
        error: `Must be between ${validationConfig.min} and ${validationConfig.max}`,
      };
    }
  }

  return { isValid: true, error: undefined };
};
