import { contributedPost } from "@controllers/admin/private/admin-private-controllers";
import express from "express";
import { check, header } from "express-validator";

const router = express.Router();

router.post(
  "/contributed_post_data",
  [
    check("post_section").trim().not().isEmpty().withMessage("Post section is required."),
    
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long.")
  ],
  contributedPost
);

export default router;
