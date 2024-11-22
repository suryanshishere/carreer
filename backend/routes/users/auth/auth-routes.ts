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

const PWD_LENGTH = Number(process.env.PWD_LENGTH) || 6;

router.post(
  "/",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: Number(PWD_LENGTH) }),
  ],
  auth
);
router.post(
  "/send-password-reset-link",
  check("email").trim().normalizeEmail().isEmail(),
  sendPasswordResetLink
);

router.post(
  ["/reset-password", "/reset-password/:userId"],
  [
    check("resetPasswordToken")
      .isInt({ min: 100000, max: 999999 })
      .withMessage("Invalid link"),
    check("password").trim().isLength({ min: PWD_LENGTH }),
  ],
  resetPassword
);
router.use(checkAuth);

router.post(
  "/verify-email",
  check("otp")
    .isInt({ min: 100000, max: 999999 })
    .withMessage("OTP must be a 6-digit number."),
  verifyEmail
);

router.post("/send-verification-otp", sendVerificationOtp);

export default router;

// router.use(checkAuth);
