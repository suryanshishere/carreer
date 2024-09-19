import express from "express";
import { check } from "express-validator";
import {
  login,
  sendVerificationEmail,
  signup,
  verifyEmail,resetPassword
} from "@controllers/users/auth/auth-controllers";
import checkAuth from "@middleware/check-auth";

const router = express.Router();

const { NAME_LENGTH, PWD_LENGTH } = process.env;

router.post(
  "/verify_email",
  check("verificationToken").trim().isLength({ min: 30, max: 30 }),
  verifyEmail
);

router.post(
  "/signup",
  [
    check("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: Number(NAME_LENGTH) || 3 }),
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: Number(PWD_LENGTH) || 6 }),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password")
      .trim()
      .isLength({ min: Number(PWD_LENGTH) }),
  ],
  login
);

router.post(
  "/forgot_password",
  [check("email").trim().normalizeEmail().isEmail()],
  sendVerificationEmail
);

router.post(
  "/reset_password",
  [
    check("resetToken").trim().isLength({ min: 30, max: 30 }),
    check("password")
      .trim()
      .isLength({ min: Number(PWD_LENGTH) }),
  ],
  resetPassword
);

router.use(checkAuth);

router.post(
  "/send_verification_email",
  [check("userId").trim().isLength({ min: 24, max: 24 })],
  sendVerificationEmail
);

// router.post(
//   "/signup-otp",
//   [
//     check("email").trim().normalizeEmail().isEmail(),
//     check("otp").trim().isLength({ min: 6, max: 6 }).isNumeric(),
//   ],
// );

export default router;
