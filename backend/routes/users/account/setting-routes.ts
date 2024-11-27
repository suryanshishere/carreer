import express from "express";
import { check } from "express-validator";
import {
  changePassword,
  deactivateAccount,
} from "@controllers/users/account/setting-controllers";

const router = express.Router();
const PWD_LENGTH = Number(process.env.PWD_LENGTH) || 6;

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
    check("old_password")
      .trim()
      .isLength({ min: PWD_LENGTH })
      .withMessage("Old password is required!"),
    check("new_password")
      .trim()
      .isLength({ min: PWD_LENGTH })
      .withMessage("New password must be minimum of 6 characters long."),
  ],
  changePassword
);

router.post(
  "/deactivate-account",
  [
    check("password")
      .trim()
      .isLength({ min: PWD_LENGTH })
      .withMessage("Password is required!"),
  ],
  deactivateAccount
);

export default router;
