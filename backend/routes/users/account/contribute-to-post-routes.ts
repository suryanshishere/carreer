import { postContributeToPost } from "@controllers/users/account/contribute-to-post-controllers";
import express from "express";
import { check, header } from "express-validator";

const router = express.Router();

router.post(
  "/contribute_to_post",
  [
    check("postId").trim().isLength({ min: 24, max: 24 }),
    check("post_section").trim().notEmpty(),
    header("userid")
      .notEmpty()
      .withMessage("User required to be logged in.")
      .isLength({ min: 24, max: 24 })
      .withMessage("User required to be logged in."),
  ],
  postContributeToPost
);

export default router;
