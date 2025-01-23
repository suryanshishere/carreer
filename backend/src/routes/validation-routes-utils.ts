import { param, body } from "express-validator";
import _ from "lodash";
import { POST_DATA, POST_LIMITS } from "@shared/env-data";

const {short_char_limit, lowercase_alpha_num_underscrore} = POST_LIMITS;

const { 
  SECTIONS, 
} = POST_DATA;

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
    .customSanitizer((value) => {
      return _.toLower(_.snakeCase(value));
    })
    .isLength({
      min: short_char_limit.min,
      max: short_char_limit.max,
    })
    .withMessage(
      `${friendlyName} must be between ${short_char_limit.min} and ${short_char_limit.max} characters.`
    )
    .matches(lowercase_alpha_num_underscrore)
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
      min: short_char_limit.min,
      max: short_char_limit.max,
    })
    .withMessage(
      `${friendlyName} must be between ${short_char_limit.min} and ${short_char_limit.max} characters.`
    );
};
