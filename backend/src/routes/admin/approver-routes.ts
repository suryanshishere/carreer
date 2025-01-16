import {
  applyContri,
  getContriPost,
  getContriPostCodes,
} from "@controllers/admin/approver/approver-controllers";
import express from "express";
import { body } from "express-validator";
import { objectCheck } from "@routes/users/user-routes";
import { postCodeCheck, sectionCheck } from "@routes/validation-routes-utils";

const router = express.Router();

router.post(
  "/apply-contri",
  [
    sectionCheck("body"),
    postCodeCheck("body"),
    objectCheck("data"),
    body("contributor_id")
      .isMongoId()
      .withMessage("Contributor ID must be a valid MongoDB ObjectId."),
  ],
  applyContri
);

router.get(
  "/contri-post-codes/:section",
  sectionCheck("param"),
  getContriPostCodes
);

router.get(
  "/contri-post-codes/:section/:postCode",
  [sectionCheck("param"), postCodeCheck("param")],
  getContriPost
);

export default router;
