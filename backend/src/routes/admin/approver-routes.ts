import {
  applyContri,
  getContriPost,
  getContriPostCodes,
} from "@controllers/admin/approver/approver-controllers";
import { sectionCheck } from "src/routes/posts/posts-routes";
import express from "express";
import { postCodeCheck } from "./publisher/publisher-routes-utils";
import { body, param } from "express-validator";
import { objectCheck } from "src/routes/users/user-routes";

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
