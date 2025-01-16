import { param, body, ValidationChain, check } from "express-validator";
import _, { snakeCase } from "lodash";
import { POST_ENV_DATA } from "@shared/env-data";

const {
  ALPHA_NUM_UNDERSCORE,
  MIN_POST_NAME_PUBLISHER,
  MAX_POST_NAME,
  MIN_POST_CODE,
  MAX_POST_CODE,
} = POST_ENV_DATA;

export const postCodeCheck = (
  source: "param" | "body",
  name?: string,
  optional?: boolean
) => {
  const validator =
    source === "param" ? param(name || "postCode") : body(name || "post_code");

  let chain = validator.trim().customSanitizer((value) => {
    return _.toUpper(_.snakeCase(value)); // Convert to snake_case and uppercase
  });

  // If the field is optional and the value is empty, skip further validation
  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  // Validate length and match rules
  chain = chain
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

  return chain;
};

export const sectionCheck = (source: "param" | "body") => {
  const validator = source === "param" ? param("section") : body("section");

  return validator
    .customSanitizer((value) => snakeCase(value))
    .isIn(POST_ENV_DATA.SECTIONS)
    .withMessage(
      `Section must be one of the following: ${POST_ENV_DATA.SECTIONS.join(
        ", "
      )}.`
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
  postCodeCheck("body"),
];
