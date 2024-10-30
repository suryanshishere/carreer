import express from "express";
import { check } from "express-validator";
import {
  sendVerificationEmail,
  auth,
  verifyEmail,
  resetPassword,
} from "@controllers/users/auth/auth-controllers";
import checkAuth from "@middleware/check-auth";

const router = express.Router();

const { NAME_LENGTH, PWD_LENGTH } = process.env;

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

router.post(
  "/verify_email",
  check("verificationToken").trim().isLength({ min: 30, max: 30 }),
  verifyEmail
);

router.post(
  "/send_verification_email",
  check("userId").trim().isLength({ min: 24, max: 24 }),
  sendVerificationEmail
);

export default router;

// router.post(
//   "/forgot_password",
//   [check("email").trim().normalizeEmail().isEmail()],
//   sendVerificationEmail
// );

// router.post(
//   "/reset_password",
//   [
//     check("resetToken").trim().isLength({ min: 30, max: 30 }),
//     check("password")
//       .trim()
//       .isLength({ min: Number(PWD_LENGTH) }),
//   ],
//   resetPassword
// );

// router.use(checkAuth);
