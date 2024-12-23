import express from "express";
import adminPublicRoutes from "./adminPublic/admin-public-routes";
import {
  accessUpdate,
  getReqAccess,
} from "@controllers/admin/admin-controllers";
import { check } from "express-validator";
import { ADMIN_DATA } from "@shared/env-data";

const router = express.Router();
const statusAndRoleCheck = [
  check("status")
    .trim()
    .isIn(ADMIN_DATA.STATUS)
    .withMessage(
      `Status must be one of the following: ${ADMIN_DATA.STATUS.join(", ")}`
    ),
  check("role_applied")
    .isIn(ADMIN_DATA.ROLE_APPLIED)
    .withMessage(
      `Role applied must be among ${ADMIN_DATA.ROLE_APPLIED.join(", ")}`
    ),
];

router.use("/public", adminPublicRoutes);
// router.use("/private", adminPrivateRoutes);

router.post("/req-access", statusAndRoleCheck, getReqAccess);

router.post(
  "/access-update",
  [
    ...statusAndRoleCheck,
    check("req_id")
      .trim()
      .isLength({ min: 24, max: 24 })
      .withMessage("Publisher ID must be exactly 24 characters long"),
  ],
  accessUpdate
);

export default router;
