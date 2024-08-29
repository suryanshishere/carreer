import express from "express";
import { postAdminData } from "@controllers/admin/public/admin-public-controllers";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/post_admin_data",
  [check("post_section").trim().not().isEmpty()],
  postAdminData
);

export default router;
