import { POST_LIMITS_DB } from "@models/posts/db";
import HttpError from "@utils/http-errors";
import { NextFunction, Request } from "express";

const {
  short_char_limit,
  long_char_limit,
  non_negative_num,
  rank_minute_num,
  age_num,
  limit_keys_division,
  dropdown_data,
} = POST_LIMITS_DB;

type ValidationConfig =
  | { type: "dropdown"; data: string[] }
  | { type: "date" }
  | { type: "numeric"; min: number; max: number }
  | { type: "string"; min: number; max: number }
  | null;

const getFieldValidation = (fieldName: string): ValidationConfig => {
  const fieldType = Object.entries(limit_keys_division).find(([_, values]) =>
    values.includes(fieldName)
  )?.[0];

  switch (fieldType) {
    case "date_keys":
      return { type: "date" };
    case "dropdown_keys": {
      const data = dropdown_data[fieldName as keyof typeof dropdown_data];
      return data ? { type: "dropdown", data } : null;
    }
    case "long_char_keys":
      return {
        type: "string",
        min: long_char_limit.min,
        max: long_char_limit.max,
      };
    case "medium_char_keys":
    case "short_char_keys":
      return {
        type: "string",
        min: short_char_limit.min,
        max: short_char_limit.max,
      };
    case "non_negative_num_keys":
      return {
        type: "numeric",
        min: non_negative_num.min,
        max: non_negative_num.max,
      };
    case "rank_minute_num_keys":
      return {
        type: "numeric",
        min: rank_minute_num.min,
        max: rank_minute_num.max,
      };
    case "age_num_keys":
      return {
        type: "numeric",
        min: age_num.min,
        max: age_num.max,
      };
    default:
      return null;
  }
};

const validateFieldValue = (
  value: string | number,
  validationConfig: ValidationConfig
): { isValid: boolean; error?: string } => {
  // Handle null config or invalid dropdown values
  if (!validationConfig) {
    return { isValid: false, error: "Invalid field configuration" };
  }

  // Handle dropdown type validation
  if (validationConfig.type === "dropdown") {
    const isValid =
      typeof value === "string" && validationConfig.data.includes(value);
    return {
      isValid,
      error: isValid
        ? undefined
        : `Value should be one of: ${validationConfig.data.join(", ")}.`,
    };
  }

  // Handle date type validation (if needed)
  if (validationConfig.type === "date") {
    const date = new Date(value);
    const isValid = !isNaN(date.getTime());

    return {
      isValid,
      error: isValid ? undefined : "Invalid date format",
    };
  }

  // For string/numeric validation, ensure value type matches config type
  const isStringType = validationConfig.type === "string";
  if (typeof value !== (isStringType ? "string" : "number")) {
    return {
      isValid: false,
      error: `Expected ${isStringType ? "string" : "number"} value`,
    };
  }

  // Get value to check (string length or numeric value)
  const valueToCheck = isStringType
    ? (value as string).length
    : (value as number);

  // Perform range validation
  if (
    valueToCheck < validationConfig.min ||
    valueToCheck > validationConfig.max
  ) {
    const unit = isStringType ? " characters" : "";
    return {
      isValid: false,
      error: `Must be between ${validationConfig.min} and ${validationConfig.max}${unit}`,
    };
  }

  return { isValid: true, error: undefined };
};

export const validateContributionField = (req: Request, next: NextFunction) => {
  const data = req.body.data;
  const errors = [];

  // Loop through each field in the data object
  for (const [key, inputValue] of Object.entries(data)) {
    const lastName = key.split(".").pop() || "";
    const validationConfig = getFieldValidation(lastName);

    // Ensure inputValue is of the correct type for validation
    const valueToValidate: string | number =
      (inputValue as string | number | Date) instanceof Date
        ? (inputValue as Date).toISOString()
        : (inputValue as string | number);

    const { isValid, error } = validateFieldValue(
      valueToValidate,
      validationConfig
    );

    // Collect errors if validation fails
    if (!isValid) {
      errors.push({
        field: key,
        message: error || `Invalid value for ${lastName}`,
      });
    }
  }

  // Check if any errors were found
  if (errors.length > 0) {
    const errorMessage = errors
      .map((err) => `${err.field}: ${err.message}`)
      .join(", ");
    return next(new HttpError(errorMessage, 400));
  }
};
