import { param, body, check } from "express-validator";
import _, { snakeCase } from "lodash";
import { POST_ENV_DATA } from "@shared/env-data";

const {
  MIN_POST_CODE,
  MAX_POST_CODE,
  SECTIONS,
  LOWERCASE_ALPHA_NUM_UNDERSCORE,
  MIN_POST_NAME_PUBLISHER,
  MAX_POST_NAME_PUBLISHER,
} = POST_ENV_DATA;

export const postCodeCheck = (
  source: "param" | "body",
  name: string = "post_code",
  optional: boolean = false
) => {
  const validator = source === "param" ? param(name) : body(name);

  const friendlyName = _.startCase(_.toLower(name));

  let chain = validator;
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
 
  return chain
    .isLength({
      min: MIN_POST_CODE,
      max: MAX_POST_CODE,
    })
    .withMessage(
      `${friendlyName} must be between ${MIN_POST_CODE} and ${MAX_POST_CODE} characters.`
    )
    .matches(LOWERCASE_ALPHA_NUM_UNDERSCORE)
    .withMessage(
      `${friendlyName} can only contain lowercase letters, numbers, and underscores, with no spaces.`
    );
};

export const sectionCheck = (
  source: "param" | "body",
  name: string = "section",
  optional: boolean = false
) => {
  const validator = source === "param" ? param(name) : body(name);

  const friendlyName = _.startCase(_.toLower(name));

  let chain = validator.customSanitizer((value) => _.snakeCase(value));

  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .isIn(SECTIONS)
    .withMessage(
      `${friendlyName} must be one of the following: ${SECTIONS.join(", ")}.`
    );
};

export const nameOfThePostCheck = (
  source: "param" | "body",
  name: string = "name_of_the_post",
  optional: boolean = false
) => {
  const validator = source === "param" ? param(name) : body(name);

  const friendlyName = _.startCase(_.toLower(name));

  let chain = validator;
  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .trim()
    .isLength({
      min: MIN_POST_NAME_PUBLISHER,
      max: MAX_POST_NAME_PUBLISHER,
    })
    .withMessage(
      `${friendlyName} must be between ${MIN_POST_NAME_PUBLISHER} and ${MAX_POST_NAME_PUBLISHER} characters.`
    );
};
