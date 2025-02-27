import {
  applyContri,
  getContriPost,
  getContriPostCodes,
} from "@controllers/admin/approver/approver-controllers";
import express from "express";
import { body } from "express-validator";
import {
  validateObject,
  validatePostCode,
  validateSection,
} from "@routes/routes-validation-utils";

const router = express.Router();

router.post(
  "/apply-contri",
  [
    validateSection(),
    validatePostCode(),
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
  "/contri-post-codes/:section/:postCode",
  [validateSection(), validatePostCode("postCode")],
  getContriPost
);

export default router;
