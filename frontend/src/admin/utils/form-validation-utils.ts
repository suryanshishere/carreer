import * as Yup from "yup";
import POST_DB, { POST_LIMITS_DB } from "posts/db";

const { short_char_limit, alpha_num_underscore_space } = POST_LIMITS_DB;

export const validateNameOfThePost = Yup.string()
  .min(
    short_char_limit.min,
    `Name of the post must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .max(
    short_char_limit.max,
    `Name of the post must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .required("Name of the post is required.");

export const validatePostCode = Yup.string()
  .min(
    short_char_limit.min,
    `Post code must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .max(
    short_char_limit.max,
    `Post code must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .matches(
    alpha_num_underscore_space,
    "Post code can only contain letters, numbers, and spaces."
  )
  .required("Post code is required.");

export const validateVersion = Yup.string()
  .min(
    short_char_limit.min,
    `Version must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .max(
    short_char_limit.max,
    `Version must be between ${short_char_limit.min}-${short_char_limit.max} characters.`
  )
  .matches(
    alpha_num_underscore_space,
    "Version can only contain letters, numbers, and spaces."
  );

export const validateApiKey = Yup.string();

export const validateSection = Yup.string()
  .required("Please select an option.")
  .oneOf(POST_DB.sections, `Must be one of: ${POST_DB.sections.join(", ")}.`);
