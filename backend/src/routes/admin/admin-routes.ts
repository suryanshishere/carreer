import express from "express";
import {
  accessUpdate,
  getReqAccess,
  getRole,
} from "@controllers/admin_controller/admin-controllers";
import { check } from "express-validator";
import { ADMIN_DATA } from "@shared/env-data";
import approverRoutes from "./approver-routes";
import publisherRoutes from "./publisher/publisher_routes";

const router = express.Router();

router.use("/publisher", publisherRoutes);

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

router.use("/approver", approverRoutes);
router.get("/get-role", getRole);

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
