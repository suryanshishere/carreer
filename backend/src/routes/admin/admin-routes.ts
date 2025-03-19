import express from "express";
import { accessUpdate, getReqAccessList, getRole } from "@controllers/admin";
import approverRoutes from "./approver-routes";
import publisherRoutes from "./publisher/publisher_routes";
import {
  validateMongoId,
  validateRoleApplied,
  validateStatus,
} from "@routes/validation-utils";
import authorizeRoles from "@middlewares/check-authorized-roles";

const router = express.Router();

router.use("/publisher", authorizeRoles(["publisher"]), publisherRoutes);
router.use("/approver", authorizeRoles(["approver"]), approverRoutes);

router.get("/get-role", getRole);

router.use(authorizeRoles(["admin"]));
router.post(
  "/req-access-list",
  [validateStatus(), validateRoleApplied()],
  getReqAccessList
);

router.post(
  "/access-update",
  [validateStatus(), validateRoleApplied(), validateMongoId("req_id")],
  accessUpdate
);

export default router;
