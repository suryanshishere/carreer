import { createNewPost } from "@controllers/admin/publisher/publisher-controllers";
import {
  validateApiKey,
  validateNameOfThePost,
  validatePostCode,
  validateSection,
} from "@routes/routes_validation_utils";
import express from "express";

const router = express.Router();
router.post(
  "/create-new-post",
  [validateSection(), validateNameOfThePost(), validatePostCode(), validateApiKey()],
  createNewPost
);

export default router;
