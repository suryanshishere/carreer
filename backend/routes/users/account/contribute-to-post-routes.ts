import {
  getUndefinedFields,
  contributeToPost,
} from "@controllers/users/account/contribute-to-post-controllers";
import express from "express";
import { check, header } from "express-validator";

const router = express.Router();

router.get(
  "/undefined_fields/:post_section/:post_id",
  [
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User required to be logged in."),
  ],
  getUndefinedFields
);

router.post(
  "/contribute_to_post",
  [
    check("post_id").trim().isLength({ min: 24, max: 24 }),
    check("post_section").trim().notEmpty(),
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User required to be logged in."),
  ],
  contributeToPost
);

export default router;
