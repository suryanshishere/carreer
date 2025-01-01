import express from "express";
import { check } from "express-validator";
import {
  sendVerificationOtp,
  auth,
  verifyEmail,
  resetPassword,
  sendPasswordResetLink,
} from "@controllers/users/auth/auth-controllers";
import { USER_ENV_DATA } from "src/shared/env-data";

const router = express.Router();
const {
  ALPHA_NUM_SPECIAL_CHAR,
  MIN_PWD_LENGTH,
  MAX_PWD_LENGTH,
  MIN_EMAIL_OTP,
  MAX_EMAIL_OTP,
  OTP_ERROR_MSG,
} = USER_ENV_DATA;

router.post(
  "/",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: Number(MIN_PWD_LENGTH), max: Number(MAX_PWD_LENGTH) }),
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
      .isInt({ min: MIN_EMAIL_OTP, max: MAX_EMAIL_OTP })
      .withMessage(OTP_ERROR_MSG),
    check("password")
      .trim()
      .isLength({ min: MIN_PWD_LENGTH, max: MAX_PWD_LENGTH })
      .withMessage(
        `Name must be between ${MIN_PWD_LENGTH} and ${MAX_PWD_LENGTH} characters.`
      )
      .matches(ALPHA_NUM_SPECIAL_CHAR)
      .withMessage(
        'Password can only contain letters, numbers, and special characters like !@#$%^&*(),.?":{}|<>_-'
      ),
  ],
  resetPassword
);

//authenticated routes
router.post(
  "/verify-email",
  check("otp")
    .isInt({ min: MIN_EMAIL_OTP, max: MAX_EMAIL_OTP })
    .withMessage(OTP_ERROR_MSG),
  verifyEmail
);

router.post("/send-verification-otp", sendVerificationOtp);

export default router;
