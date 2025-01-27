import { createNewPost } from "@controllers/admin/publisher/publisher-controllers";
import {
  validateNameOfThePost,
  validatePostCode,
  validateSection,
} from "@routes/routes-validation-utils";
import express from "express";

const router = express.Router();
router.post(
  "/create-new-post",
  [validateSection("body"), validateNameOfThePost("body"), validatePostCode("body")],
  createNewPost
);

export default router;
