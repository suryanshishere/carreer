import express from "express";
import { check, header } from "express-validator";
import {
  sendVerificationOtp,
  auth,
  verifyEmail,
  resetPassword,
  sendPasswordResetLink,
} from "@controllers/users/auth/auth-controllers";
import checkAuth from "@middleware/check-auth";

const router = express.Router();

const { NAME_LENGTH } = process.env;
const PWD_LENGTH = Number(process.env.PWD_LENGTH);

router.post(
  "/",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: Number(PWD_LENGTH) || 6 }),
  ],
  auth
);

//auth check then below

router.post(
  "/verify_email",
  check("otp")
    .isInt({ min: 100000, max: 999999 })
    .withMessage("OTP must be a 6-digit number."),
  header("userid")
    .isLength({ min: 24, max: 24 })
    .withMessage("User required to be logged in."),
  verifyEmail
);

router.post(
  "/send_verification_otp",
  header("userid")
    .isLength({ min: 24, max: 24 })
    .withMessage("User required to be logged in."),
  sendVerificationOtp
);

router.post(
  "/send_password_reset_link",
  check("email").trim().normalizeEmail().isEmail(),
  sendPasswordResetLink
);

router.post(
  "/reset_password",
  [
    check("resetPasswordToken")
      .isInt({ min: 100000, max: 999999 })
      .withMessage("Invalid link"),
    check("password").trim().isLength({ min: PWD_LENGTH }),
    header("userid").isLength({ min: 24, max: 24 }),
  ],
  resetPassword
);
export default router;

// router.use(checkAuth);
