import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/posts/posts-controllers";
import { param } from "express-validator";
import { snakeCase } from "lodash";
import { postSectionsArray } from "@shared/post-array";

const router = express.Router();

const sectionParamCheck = param("section")
  .customSanitizer((value) => snakeCase(value))
  .isIn(postSectionsArray)
  .withMessage(
    `Section must be one of the following: ${postSectionsArray.join(", ")}.`
  );

router.get(["/", "/home"], home);
router.get("/sections/:section", sectionParamCheck, section);
router.get(
  "/sections/:section/:postId",
  [
    sectionParamCheck,
    param("postId")
      .isMongoId()
      .withMessage("Post ID must be a valid MongoDB ObjectId."),
  ],
  postDetail
);

export default router;
