import express from "express";
import { check } from "express-validator";
import {
  changePassword,
} from "../../../controllers/users/account/setting-controllers";

const router = express.Router();

// router.post(
//   "/:userId/account-info",
//   [check("password").trim().isLength({ min: 5 })],
//   getAccountInfo
// );

// router.patch("/:userId/account-info", editAccountInfo);

// router.post("/:userId/deactivate", deactivateAccount);

// router.get("/:userId/reactivate", reactivateAccount);

// router.get("/:userId/deactivate-at", deactivateAt);

router.post(
  "/change-password",
  [
    check("email").trim().not().isEmpty(),
    check("password").trim().isLength({ min: 5 }),
    check("newPassword").trim().isLength({ min: 5 }),
  ],
  changePassword
);

export default router;
