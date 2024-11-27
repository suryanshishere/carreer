import {
  bookmarkPost,
  savedPosts,
  unBookmarkPost,
} from "@controllers/users/account/account-posts-controllers";
import {
  getUndefinedFields,
  contributeToPost,
} from "@controllers/users/account/contribute-to-post-controllers";
import { changePassword } from "@controllers/users/account/setting-controllers";
import { postRefs } from "@models/post/post-model";
import express from "express";
import { check } from "express-validator";
import _ from "lodash";

const router = express.Router();

router.get(
  "/undefined_fields/:post_section/:post_id",
  [
    // header("userid")
    //   .isLength({ min: 24, max: 24 })
    //   .withMessage("User required to be logged in."),
  ],
  getUndefinedFields
);

router.post(
  "/contribute_to_post",
  [
    check("post_id").trim().isLength({ min: 24, max: 24 }),
    check("post_section").trim().notEmpty(),
  ],
  contributeToPost
);

router.get("/saved-posts", savedPosts);

const bookmarkMiddleware = [
  check("post_id").trim().isLength({ min: 24, max: 24 }),
  check("category")
    .trim()
    .notEmpty()
    .custom((value) => {
      const lowerCaseCategory = value.toLowerCase();

      // Generate the list of accepted categories
      const acceptedCategories = _.flatMap(postRefs, (category) => [
        _.toLower(category), // Lowercase version
        _.snakeCase(category), // snake_case version
      ]);

      if (!acceptedCategories.includes(lowerCaseCategory)) {
        throw new Error("Invalid category");
      }
      return true;
    }),
];

router.post("/bookmark", bookmarkMiddleware, bookmarkPost);

router.post("/un-bookmark", bookmarkMiddleware, unBookmarkPost);

export default router;
