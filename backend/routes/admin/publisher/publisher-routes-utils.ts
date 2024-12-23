import { check } from "express-validator";
import _, { snakeCase } from "lodash";
import { postSectionsArray } from "@shared/post-array";
import { POST_ENV_DATA } from "@shared/env-data";

const {
  ALPHA_NUM_UNDERSCRORE,
  MIN_POST_NAME_PUBLISHER,
  MAX_POST_NAME,
  MIN_POST_CODE,
  MAX_POST_CODE,
} = POST_ENV_DATA;

export const createNewPostValidators = [
  check("section")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Post section is required.")
    .customSanitizer((value) => snakeCase(value))
    .isIn(postSectionsArray)
    .withMessage(
      `Section must be one of the following: ${postSectionsArray.join(", ")}.`
    ),
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
  check("post_code")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Post code is required.")
    .customSanitizer((value) => {
      return _.toUpper(_.snakeCase(value));
    })
    .isLength({
      min: MIN_POST_CODE,
      max: MAX_POST_CODE,
    })
    .withMessage(
      `Post code must be between ${MIN_POST_CODE} and ${MAX_POST_CODE} characters.`
    )
    .isString()
    .withMessage("Post code must be a string.")
    .matches(ALPHA_NUM_UNDERSCRORE)
    .withMessage(
      "Post code can only contain letters, numbers, and underscores, with no spaces."
    ),
];
