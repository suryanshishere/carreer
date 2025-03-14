import express from "express";
import postRoutes from "./account-posts-routes";
import settingRoutes from "./account-setting-routes";
import modeRoutes from "./account-mode-routes";
import { reqAccess } from "@controllers/users/account-controller/account-controllers"; 
 
import { body } from "express-validator";
import { ADMIN_DATA, CONTACT_US_ENV_DATA } from "@models/admin/db";

const router = express.Router();
const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = CONTACT_US_ENV_DATA;

router.post(
  "/req-access",
  [
    body("reason")
      .trim()
      .isLength({ min: MIN_REASON_LENGTH, max: MAX_REASON_LENGTH })
      .withMessage(
        `Reason must be between ${MIN_REASON_LENGTH} and ${MAX_REASON_LENGTH} characters.`
      ),
    body("role_applied")
      .isIn(ADMIN_DATA.ROLE_APPLIED)
      .withMessage(
        `Role applied must be among ${ADMIN_DATA.ROLE_APPLIED.join(", ")}`
      ),
  ],
  reqAccess
);
router.use("/mode", modeRoutes);
router.use("/post", postRoutes);
router.use("/setting", settingRoutes);

export default router;
