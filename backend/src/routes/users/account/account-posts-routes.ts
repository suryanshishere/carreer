import {
  bookmarkPost,
  savedPosts,
  unBookmarkPost,
} from "@controllers/users/account/account-posts-controllers";
import express from "express";
import { check } from "express-validator";
import _ from "lodash";

const router = express.Router();

router.get("/saved-posts", savedPosts);

const bookmarkMiddleware = [
  check("post_id").trim().isLength({ min: 24, max: 24 }),
  check("section").trim().notEmpty().withMessage("Section is required!"),
];

router.post("/bookmark", bookmarkMiddleware, bookmarkPost);

router.post("/un-bookmark", bookmarkMiddleware, unBookmarkPost);

export default router;
