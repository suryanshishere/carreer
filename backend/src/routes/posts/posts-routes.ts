import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/posts";
import {
  validatePostCodeOrVersion,
  validatePostIdOrCode,
  validateSection,
} from "@routes/utils";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", validateSection(), section);
router.get(
  "/sections/:section/:postIdOrCode/:version",
  [
    validateSection(),
    validatePostIdOrCode(),
    validatePostCodeOrVersion("version", true),
  ],
  postDetail
);

export default router;
