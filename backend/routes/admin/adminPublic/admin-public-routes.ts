import express from "express";
import { postAdminData } from "@controllers/admin/admin-public-controllers";
import { check } from "express-validator";

const router = express.Router();

router.get(
  "/post_admin_data",
  [check("post_category").trim().not().isEmpty()],
  postAdminData
);

export default router;
