import { ADMIN_DATA } from "@models/admin/db";
import POST_DB, { POST_LIMITS_DB } from "@models/posts/db";
import { ValidationChain, check } from "express-validator";
import _, { startCase } from "lodash";

const { short_char_limit, lowercase_alpha_num_underscrore } = POST_LIMITS_DB;

const { sections } = POST_DB;

export const validatePostCodeOrVersion = (
  field: string = "post_code",
  optional: boolean = false,
  extra: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(field));

  let chain = check(field);
  if (field == "version" || optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .customSanitizer((value) => {
      return _.toLower(_.snakeCase(value));
    })
    .isLength({
      min: short_char_limit.min,
      max: (extra ? 2 : 1) * short_char_limit.max, //extra when version also included.
    })
    .withMessage(
      `${friendlyName} must be between ${short_char_limit.min} and ${short_char_limit.max} characters.`
    )
    .matches(lowercase_alpha_num_underscrore)
    .withMessage(`${friendlyName} is not in correct format.`);
};

export const validatePostIdOrCode = (
  field: string = "postIdOrCode",
  optional: boolean = false
) => {
  let chain = check(field);

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
      const isValidPostCode = validatePostCodeOrVersion(field)
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
  field: string = "section",
  optional: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(field));

  let chain = check(field).customSanitizer((value) => _.snakeCase(value));

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
  field: string = "name_of_the_post",
  optional: boolean = false
) => {
  const friendlyName = _.startCase(_.toLower(field));

  let chain = check(field);
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
      const keys = Object.keys(value);
      if (keys.length === 0) {
        throw new Error(`${fieldName} must not be empty.`);
      }

      // Updated regex: allow lowercase letters, numbers, underscores, and dots.
      const validKeyRegex = /^[a-z0-9_.]+$/;

      keys.forEach((originalKey) => {
        // Prevent nested objects as values.
        if (
          typeof value[originalKey] === "object" &&
          value[originalKey] !== null
        ) {
          throw new Error(
            `${fieldName} must be a simple key-value pair. Nested objects are not allowed.`
          );
        }

        // Transform the key: lower-case and replace spaces with underscores.
        const transformedKey = originalKey.toLowerCase().replace(/\s+/g, "_");

        // If the key was transformed, update the object.
        if (transformedKey !== originalKey) {
          value[transformedKey] = value[originalKey];
          delete value[originalKey];
        }

        // Validate that the (possibly transformed) key meets the regex.
        if (!validKeyRegex.test(transformedKey)) {
          throw new Error(
            `${fieldName} contains an invalid key: "${originalKey}". Keys must be lowercase and use underscores in place of spaces.`
          );
        }
      });

      return true;
    });
};

export const validateOptStr = (field: string, optional: boolean = true) => {
  let chain = check(field);
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
  return chain.isString().withMessage(`${startCase(field)} must be a string.`);
};

export const validateStatus = (
  field: string = "status",
  optional: boolean = false
): ValidationChain => {
  let chain = check(field);
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
  return chain
    .trim()
    .isIn(ADMIN_DATA.STATUS)
    .withMessage(`${field} be one of them: ${ADMIN_DATA.STATUS.join(", ")}.`);
};

export const validateRoleApplied = (
  field: string = "role_applied",
  optional: boolean = false
): ValidationChain => {
  let chain = check(field);
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
  return chain
    .isIn(ADMIN_DATA.ROLE_APPLIED)
    .withMessage(
      `${field} be one of them: ${ADMIN_DATA.ROLE_APPLIED.join(", ")}.`
    );
};

export const validateMongoId = (
  field: string,
  optional: boolean = false
): ValidationChain => {
  let chain = check(field);
  if (optional) {
    chain = chain.optional({ nullable: true });
  }
  return chain.isMongoId().withMessage(`${field} must be valid ID.`);
};

export const validateBoolean = (
  field: string,
  optional: boolean = false
): ValidationChain => {
  let chain = check(field);

  if (optional) {
    chain = chain.optional({ nullable: true });
  }

  return chain
    .isBoolean()
    .withMessage(`${field} must be a boolean value.`)
    .toBoolean(); // Converts the input to a proper boolean (true/false)
};
