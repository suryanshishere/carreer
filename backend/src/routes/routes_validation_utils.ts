import POST_DB, { POST_LIMITS_DB } from "@models/post_models/post_db";
import { ValidationChain, check } from "express-validator";
import _, { startCase } from "lodash";

const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

const { sections } = POST_DB;

export const validatePostCode = (
  name: string = "post_code",
  optional: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(name));

  let chain = check(name);
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

export const validatePostIdOrCode = (
  name: string = "postIdOrCode",
  optional: boolean = false
) => {
  let chain = check(name);

  // Apply optional logic
  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .custom(async (value, { req }) => {
      // Skip validation if optional and the value is not provided
      if (optional && (value === null || value === undefined || value === "")) {
        return true;
      }

      // Check MongoDB ID validity
      const isMongoId = /^[a-f\d]{24}$/i.test(value);

      // Check post code validity
      const isValidPostCode = validatePostCode(name)
        .run(req)
        .then((result) => result.isEmpty());

      const [mongoIdValid, postCodeValid] = await Promise.all([
        isMongoId,
        isValidPostCode,
      ]);

      if (!mongoIdValid && !postCodeValid) {
        throw new Error("Invalid MongoDB ID or post code format.");
      }

      return true;
    })
    .withMessage("Invalid MongoDB ID or post code format.");
};

export const validateSection = (
  name: string = "section",
  optional: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(name));

  let chain = check(name).customSanitizer((value) => _.snakeCase(value));

  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .isIn(sections)
    .withMessage(
      `${friendlyName} must be one of the following: ${sections.join(", ")}.`
    );
};

export const validateNameOfThePost = (
  name: string = "name_of_the_post",
  optional: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(name));

  let chain = check(name);
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

export const validateObject = (fieldName: string): ValidationChain => {
  return check(fieldName)
    .isObject()
    .withMessage(`${fieldName} must be an object.`)
    .custom((value) => {
      if (Object.keys(value).length === 0) {
        throw new Error(`${fieldName} must not be empty.`);
      }
      return true;
    });
};

export const validateOptStr = (
  name: string,
  optional: boolean = true
) => {
  let chain = check(name);
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
  return chain.isString().withMessage(`${startCase(name)} must be a string.`);
};

