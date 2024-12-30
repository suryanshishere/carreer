import { param, body, ValidationChain, check } from "express-validator";
import _ from "lodash";
import { POST_ENV_DATA } from "@shared/env-data";
import { sectionCheck } from "@routes/posts/posts-routes";

const {
  ALPHA_NUM_UNDERSCORE,
  MIN_POST_NAME_PUBLISHER,
  MAX_POST_NAME,
  MIN_POST_CODE,
  MAX_POST_CODE,
} = POST_ENV_DATA;

export const postCodeCheck = (source: "param" | "body"): ValidationChain => {
  const validator = source === "param" ? param("postCode") : body("post_code");

  return validator
    .trim()
    .customSanitizer((value) => {
      return _.toUpper(_.snakeCase(value)); // Convert to snake_case and uppercase
    })
    .isLength({
      min: MIN_POST_CODE,
      max: MAX_POST_CODE,
    })
    .withMessage(
      `Post code must be between ${MIN_POST_CODE} and ${MAX_POST_CODE} characters.`
    )
    .matches(ALPHA_NUM_UNDERSCORE)
    .withMessage(
      "Post code can only contain letters, numbers, and underscores, with no spaces."
    );
};

export const createNewPostValidators = [
  sectionCheck("body"),
  check("name_of_the_post")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name of the post is required.")
    .isLength({
      min: MIN_POST_NAME_PUBLISHER,
      max: MAX_POST_NAME,
    })
    .withMessage(
      `Name of the post must be between ${MIN_POST_NAME_PUBLISHER} and ${MAX_POST_NAME} characters.`
    ),
  postCodeCheck,
];
