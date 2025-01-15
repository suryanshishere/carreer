import { modeAccountHandler } from "@controllers/users/account/account-mode-controllers";
import { accountModeType, USER_ENV_DATA } from "@shared/env-data";
import express from "express";
import { body } from "express-validator";

const { ACCOUNT_MODE } = USER_ENV_DATA;

const router = express.Router();

//it's work for the post first items setting even though it's dyanmic
router.post(
  "/",
  body("mode")
    .isObject()
    .withMessage("Mode must be a non-empty object.")
    .custom((value) => Object.keys(value).length > 0)
    .withMessage("Mode cannot be an empty object.")
    .custom((value) => {
      const key = Object.keys(value)[0];
      return ACCOUNT_MODE.includes(key as accountModeType);
    })
    .withMessage(`Mode key must be one of: ${ACCOUNT_MODE.join(", ")}`),
  modeAccountHandler
);

export default router;
