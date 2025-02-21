import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/posts/posts-controllers";
import {
  validatePostIdOrCode,
  validateSection,
} from "@routes/routes-validation-utils";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", validateSection(), section);
router.get(
  "/sections/:section/:postIdOrCode",
  [validateSection(), validatePostIdOrCode()],
  postDetail
);

export default router;
