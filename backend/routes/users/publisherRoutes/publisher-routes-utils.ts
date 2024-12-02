import { check } from "express-validator";
import { isString, snakeCase } from "lodash";

// Load environment variables
const POST_SECTION_MIN = parseInt(process.env.POST_SECTION_MIN || "3", 10);
const POST_SECTION_MAX = parseInt(process.env.POST_SECTION_MAX || "100", 10);
const POST_NAME_MIN = parseInt(process.env.POST_NAME_MIN || "6", 10);
const POST_NAME_MAX = parseInt(process.env.POST_NAME_MAX || "1000", 10);
const POST_CODE_MIN = parseInt(process.env.POST_CODE_MIN || "6", 10);
const POST_CODE_MAX = parseInt(process.env.POST_CODE_MAX || "1000", 10);

export const createNewPostValidators = [
  check("section")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Post section is required.")
    .isLength({ min: POST_SECTION_MIN, max: POST_SECTION_MAX })
    .withMessage(
      `Post section must be between ${POST_SECTION_MIN} and ${POST_SECTION_MAX} characters.`
    )
    .customSanitizer((value) => snakeCase(value)),
  check("name_of_the_post")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name of the post is required.")
    .isLength({ min: POST_NAME_MIN, max: POST_NAME_MAX })
    .withMessage(
      `Name of the post must be between ${POST_NAME_MIN} and ${POST_NAME_MAX} characters.`
    ),
  check("post_code")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Post code is required.")
    .isLength({ min: POST_CODE_MIN, max: POST_CODE_MAX })
    .withMessage(
      `Post code must be between ${POST_CODE_MIN} and ${POST_CODE_MAX} characters.`
    )
    .custom((value) => {
      // Ensure that the value is a string and matches the allowed pattern
      if (!isString(value)) {
        throw new Error("Post code must be a string.");
      }
      const regex = /^[A-Za-z0-9_]+$/;
      if (!regex.test(value)) {
        throw new Error("Post code can only contain letters, numbers, and underscores, with no spaces.");
      }
      return true;
    })
    .withMessage("Post code can only contain letters, numbers, and underscores, with no spaces."),
];
