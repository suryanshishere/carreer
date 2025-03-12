import {
  applyContri,
  getContriPost,
  getContriPostCodes,
} from "@controllers/admin-controller/approver/approver-controllers";
import express from "express";
import { body } from "express-validator";
import {
  validateObject,
  validatePostCode,
  validateSection,
} from "@routes/routes_validation_utils";

const router = express.Router();

router.post(
  "/apply-contri",
  [
    validateSection(),
    validatePostCode(),
    validatePostCode("version", true),
    validateObject("data"),
    body("contributor_id")
      .isMongoId()
      .withMessage("Contributor ID must be a valid MongoDB ObjectId."),
  ],
  applyContri
);

router.get(
  "/contri-post-codes/:section",
  validateSection("section"),
  getContriPostCodes
);

router.get(
  "/contri-post-codes/:section/:postCodeVersion",
  [validateSection(), validatePostCode("postCodeVersion", false, true)],
  getContriPost
);

export default router;
