import { postCreatePost } from "@controllers/users/account/create-post-controllers";
import express from "express";
import { check, header } from "express-validator";

const router = express.Router();

router.post(
  "/create_post",
  [
    check("postId").trim().isLength({ min: 24, max: 24 }),
    header("userid")
      .notEmpty()
      .withMessage("User required to be logged in.")
      .isLength({ min: 24, max: 24 })
      .withMessage("User required to be logged in."),
  ],
  postCreatePost
);

export default router;
