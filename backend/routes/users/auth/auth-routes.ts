import express from "express";
import { check } from "express-validator";
import {
  login,
  signup,
  verifyEmail,
} from "../../../controllers/users/auth/auth-controllers";

const router = express.Router();

const {NAME_LENGTH, PWD_LENGTH} = process.env

router.post(
  "/verify_email/:verificationToken",
  verifyEmail
)

router.post(
  "/signup",
  [
    check("name").trim().not().isEmpty().isLength({ min: Number(NAME_LENGTH) }),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: Number(PWD_LENGTH) }),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: Number(PWD_LENGTH) }),
  ],
  login
);

// router.post(
//   "/signup-otp",
//   [
//     check("email").trim().normalizeEmail().isEmail(),
//     check("otp").trim().isLength({ min: 6, max: 6 }).isNumeric(),
//   ],
// );

export default router;
