import express from "express";
import authRoutes from "./auth/auth-routes";
import accountRoutes from "./account/account-routes";
import { check } from "express-validator";
import { ADMIN_DATA, CONTACT_US_ENV_DATA } from "@shared/env-data";
import {
  contributeToPost,
  reqAccess,
} from "@controllers/users/user-controllers";

const router = express.Router();
const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = CONTACT_US_ENV_DATA;

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.post("/contribute-to-post", contributeToPost);
router.post(
  "/req-access",
  [
    check("reason")
      .trim()
      .isLength({ min: MIN_REASON_LENGTH, max: MAX_REASON_LENGTH })
      .withMessage(
        `Reason must be between ${MIN_REASON_LENGTH} and ${MAX_REASON_LENGTH} characters.`
      ),
    check("role_applied")
      .isIn(ADMIN_DATA.ROLE_APPLIED)
      .withMessage(
        `Role applied must be among ${ADMIN_DATA.ROLE_APPLIED.join(", ")}`
      ),
  ],
  reqAccess
);

export default router;
