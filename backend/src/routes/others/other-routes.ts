import { contactUs } from "@controllers/others"; 
import { CONTACT_US_ENV_DATA } from "@models/admin/db";
import express from "express";
import { check } from "express-validator";
const router = express.Router();

const {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_REASON_LENGTH,
  MAX_REASON_LENGTH,
} = CONTACT_US_ENV_DATA;

router.post(
  "/contact-us",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("name")
      .trim()
      .isLength({
        min: MIN_NAME_LENGTH,
        max: MAX_NAME_LENGTH,
      })
      .withMessage(
        `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`
      ),
    check("reason")
      .trim()
      .isLength({
        min: MIN_REASON_LENGTH,
        max: MAX_REASON_LENGTH,
      })
      .withMessage(
        `Reason must be between ${MIN_REASON_LENGTH} and ${MAX_REASON_LENGTH} characters.`
      ),
  ],
  contactUs
);

export default router;
