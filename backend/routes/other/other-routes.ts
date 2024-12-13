import { contactUs } from "@controllers/other/other-controllers";
import express from "express";
import { check } from "express-validator";
const router = express.Router();

const MIN_NAME_LENGTH = Number(process.env.MIN_NAME_LENGTH) || 3;
const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH) || 100;
const MIN_REASON_LENGTH = Number(process.env.MIN_REASON_LENGTH) || 100;
const MAX_REASON_LENGTH = Number(process.env.MAX_REASON_LENGTH) || 500;

router.post(
  "/contact-us",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("name")
      .trim()
      .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH }),
    check("reason")
      .trim()
      .isLength({ min: MIN_REASON_LENGTH, max: MAX_REASON_LENGTH }),
  ],
  contactUs
);

export default router;
