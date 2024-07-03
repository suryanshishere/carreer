import express from "express";
import { check } from "express-validator";
import {
  login,
  resetPasswordAndVerifyOTP,
  signup,
} from "../../../controllers/users/auth/auth-controllers";

const router = express.Router();

router.post(
  "/signup",
  [
    check("name").trim().not().isEmpty(),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 5 }),
  ],
  signup
);

router.post(
  "/signup-otp",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("otp").trim().isLength({ min: 6, max: 6 }).isNumeric(),
  ],
  resetPasswordAndVerifyOTP
);

router.post(
  "/login",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 5 }),
  ],
  login
);

export default router;
