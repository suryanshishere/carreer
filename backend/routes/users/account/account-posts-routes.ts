import {
  bookmarkPost,
  savedPosts,
} from "@controllers/users/account/account-posts-controllers";
import {
  getUndefinedFields,
  contributeToPost,
} from "@controllers/users/account/contribute-to-post-controllers";
import { changePassword } from "@controllers/users/account/setting-controllers";
import { postRefs } from "@models/post/post-model";
import express from "express";
import { check } from "express-validator";

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

router.post(
  "/bookmark",
  [
    check("post_id").trim().isLength({ min: 24, max: 24 }),
    check("category")
      .trim()
      .notEmpty()
      .custom((value) => {
        const lowerCaseCategory = value.toLowerCase();
        // Check against both camelCase and snake_case categories
        const acceptedCategories = postRefs
          .map((category: string) => [
            category.toLowerCase(), // snake_case version
            category.replace(/([A-Z])/g, "_$1").toLowerCase(), // snake_case format
          ])
          .flat();

        if (!acceptedCategories.includes(lowerCaseCategory)) {
          throw new Error("Invalid category");
        }
        return true;
      }),
  ],
  bookmarkPost
);

router.get("/saved-posts", savedPosts);

router.post(
  "/change-password",
  [
    check("old_password")
      .trim()
      .notEmpty()
      .withMessage("Old password is required!"),
    check("new_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("New password must be minimum of 6 characters long."),
  ],
  changePassword
);

export default router;
