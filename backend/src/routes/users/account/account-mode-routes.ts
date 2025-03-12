import { modeAccountHandler } from "@controllers/users/account-controller/account-mode-controllers";
import express from "express";
import { body } from "express-validator";

const router = express.Router();

//it's work for the post first items setting even though it's dyanmic
router.post(
  "/",
  body("mode")
    .isObject()
    .withMessage("Mode must be a non-empty object.")
    .custom((value) => Object.keys(value).length > 0)
    .withMessage("Mode cannot be an empty object."),
  modeAccountHandler
);

export default router;
