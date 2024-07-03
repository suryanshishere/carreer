import express from "express";
import { check } from "express-validator";
import {
  getResetTimer,
  resetPasswordAndVerifyOTP,
  sendOTP,
} from "../../../controllers/users/auth/auth-controllers";

const router = express.Router();

router.post(
  "/forgot-password",
  [check("email").trim().normalizeEmail().isEmail()],
  sendOTP
);

router.post(
  "/reset-password",
  [
    check("email").trim().not().isEmpty(),
    check("otp").trim().isLength({ min: 6, max: 6 }).isNumeric(),
    check("password").trim().isLength({ min: 5 }),
  ],
  resetPasswordAndVerifyOTP
);

router.post("/reset-password/timer", getResetTimer);

export default router;
