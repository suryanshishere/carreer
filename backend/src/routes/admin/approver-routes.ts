import {
  applyContri,
  getContriPost,
  getContriPostCodes,
  nonApprovedPosts,
  postApproval,
} from "@controllers/admin/approver/approver-controllers";
import express from "express";
import { body } from "express-validator";
import {
  validateBoolean,
  validateMongoId,
  validateObject,
  validateOptStr,
  validatePostCodeOrVersion,
  validateSection,
} from "@routes/validation-utils";

const router = express.Router();

router.post(
  "/apply-contri",
  [
    validateSection(),
    validatePostCodeOrVersion(),
    validatePostCodeOrVersion("version"),
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
  "/contri-post-codes/:section/:postCode/:version?",
  [
    validateSection(),
    validatePostCodeOrVersion("postCode"),
    validatePostCodeOrVersion("version"),
  ],
  getContriPost
);

router.get(
  "/non-approved-posts/:section/:active?",
  [validateSection(), validateOptStr("active")],
  nonApprovedPosts
);

router.patch(
  "/post-approval",
  [validateSection(), validateMongoId("postId"), validateBoolean("approved")],
  postApproval
);

export default router;
