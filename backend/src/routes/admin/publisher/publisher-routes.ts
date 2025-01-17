import { createNewPost } from "@controllers/admin/publisher/publisher-controllers";
import {
  nameOfThePostCheck,
  postCodeCheck,
  sectionCheck,
} from "@routes/validation-routes-utils";
import express from "express";

const router = express.Router();
router.post(
  "/create-new-post",
  [sectionCheck("body"), nameOfThePostCheck("body"), postCodeCheck("body")],
  createNewPost
);

export default router;
