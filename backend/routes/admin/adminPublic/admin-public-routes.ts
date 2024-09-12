import express from "express";
import { postAdminData } from "@controllers/admin/public/admin-public-controllers";
import { check, header } from "express-validator";

const router = express.Router();

router.get(
  "/:post_section/post_admin_data",
  [
    header("userid")
      .isLength({ min: 24, max: 24 })
      .withMessage("User ID must be 24 characters long."),
  ],
  postAdminData
);

export default router;
