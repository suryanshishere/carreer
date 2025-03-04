import express from "express";
import {
  home,
  postDetail,
  section,
} from "@controllers/post-controller";
import {
  validatePostCode,
  validatePostIdOrCode,
  validateSection,
} from "@routes/routes_validation_utils";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", validateSection(), section);
router.get(
  "/sections/:section/:postIdOrCode/:version",
  [
    validateSection(),
    validatePostIdOrCode(),
    validatePostCode("version", true),
  ],
  postDetail
);

export default router;
