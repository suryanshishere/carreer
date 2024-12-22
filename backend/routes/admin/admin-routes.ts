import express from "express";
import adminPublicRoutes from "./adminPublic/admin-public-routes";
import {
  accessUpdate,
  getReqAccess,
} from "@controllers/admin/admin-controllers";
import { check } from "express-validator";
import { ADMIN_DATA } from "@shared/env-data";

const router = express.Router();

router.use("/public", adminPublicRoutes);
// router.use("/private", adminPrivateRoutes);

const statusCheck = check("status")
  .trim()
  .isIn(ADMIN_DATA.STATUS)
  .withMessage(
    `Status must be one of the following: ${ADMIN_DATA.STATUS.join(", ")}`
  );

router.post(
  "/req-access",
  [
    statusCheck,
    check("role_applied")
      .isIn(ADMIN_DATA.ROLE_APPLIED)
      .withMessage(
        `Role applied must be among ${ADMIN_DATA.ROLE_APPLIED.join(", ")}`
      ),
  ],
  getReqAccess
);

const publisherIdCheck = check("publisher_id")
  .trim()
  .isLength({ min: 24, max: 24 })
  .withMessage("Publisher ID must be exactly 24 characters long");

router.post(
  "/publisher-access-update",
  [statusCheck, publisherIdCheck],
  accessUpdate
);

export default router;
