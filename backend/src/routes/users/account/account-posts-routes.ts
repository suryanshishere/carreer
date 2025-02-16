import {
  bookmarkPost,
  contributeToPost,
  deleteContribute,
  myContribution,
  savedPosts,
  unBookmarkPost,
} from "@controllers/users/account/account-posts-controllers";
import express from "express";
import _ from "lodash";
import {
  validateObject,
  validatePostCode,
  validateSection,
} from "@routes/routes-validation-utils";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/contribute-to-post",
  [validateSection("body"), validatePostCode("body"), validateObject("data")],
  contributeToPost
);

router.patch("/delete-contribution", deleteContribute);

router.get("/my-contribution", myContribution);

router.get("/saved-posts", savedPosts);

const bookmarkMiddleware = [
  body("post_id").trim().isLength({ min: 24, max: 24 }),
  body("section").trim().notEmpty().withMessage("Section is required!"),
];

router.post("/bookmark", bookmarkMiddleware, bookmarkPost);

router.post("/un-bookmark", bookmarkMiddleware, unBookmarkPost);

export default router;
