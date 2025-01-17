import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/posts/posts-controllers";
import { param } from "express-validator";
import { postCodeCheck, sectionCheck } from "@routes/validation-routes-utils";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", sectionCheck("param"), section);
router.get(
  "/sections/:section/:postIdOrCode",
  [
    sectionCheck("param"),
    //TODO
    // param("postIdOrCode")
    //   .optional()
    //   .isMongoId()
    //   .withMessage("Post ID must be a valid MongoDB ObjectId."),
    // postCodeCheck("param", "postIdOrCode", true),
  ],
  postDetail
);

export default router;
