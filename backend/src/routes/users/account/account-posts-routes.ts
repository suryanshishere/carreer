import {
  bookmarkPost,
  contributeToPost,
  deleteContribute,
  myContribution,
  savedPosts,
  unBookmarkPost,
} from "@controllers/user-controller/account/account-posts-controllers";
import express from "express";
import _ from "lodash";
import {
  validateObject,
  validatePostCode,
  validateSection,
} from "@routes/routes_validation_utils";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/contribute-to-post",
  [
    validateSection(),
    validatePostCode("post_code_version", false, true),
    validateObject("data"),
  ],
  contributeToPost
);

router.patch(
  "/delete-contribution",
  [validatePostCode("post_code_version", false, true), validateSection()],
  deleteContribute
);

router.get("/my-contribution", myContribution);

router.get("/saved-posts", savedPosts);

const bookmarkMiddleware = [
  body("post_id").trim().isLength({ min: 24, max: 24 }),
  validateSection(),
];

router.post("/bookmark", bookmarkMiddleware, bookmarkPost);

router.post("/un-bookmark", bookmarkMiddleware, unBookmarkPost);

export default router;
