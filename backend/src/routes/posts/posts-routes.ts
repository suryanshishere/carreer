import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/posts/posts-controllers";
import { body, param } from "express-validator";
import { snakeCase } from "lodash";
import { POST_ENV_DATA } from "@shared/env-data";

const router = express.Router();

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

router.get(["/", "/home"], home);
router.get("/sections/:section", sectionCheck("param"), section);
router.get(
  "/sections/:section/:postId",
  [
    sectionCheck("param"),
    param("postId")
      .isMongoId()
      .withMessage("Post ID must be a valid MongoDB ObjectId."),
  ],
  postDetail
);

export default router;
