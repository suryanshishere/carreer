
import {
  approvePost,
  contributedPost,
  createNewPost,
} from "@controllers/admin/private/admin-private-controllers";
import {
  getAllPostAdminData,
  getEditPost,
} from "@controllers/admin/private/edit-post-controllers";
import express from "express";
import { check, header } from "express-validator";

const router = express.Router();

router.get(
  "/:post_section/all_post_admin_data",
  [
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  getAllPostAdminData
);

router.post(
  "/contributed_post_data",
  [
    check("post_section")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Post section is required."),

    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  contributedPost
);

router.post(
  "/approve_post",
  [
    check("post_section")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Post section is required."),

    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  approvePost
);

router.get(
  "/edit_post/:post_section/:post_id",
  [
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  getEditPost
);

router.post(
  "/create_new_post",
  [
    check("post_section")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Post section is required."),

    check("name_of_the_post")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name of the post is required."),
    check("post_code")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Post code is required."),

    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  createNewPost
);

export default router;
