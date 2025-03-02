import {
  createNewPost,
  deletePost,
} from "@controllers/admin/publisher/publisher-controllers";
import {
  validateOptStr,
  validateNameOfThePost,
  validatePostCode,
  validateSection,
  validatePostIdOrCode,
} from "@routes/routes_validation_utils";
import express from "express";

const router = express.Router();
router.post(
  "/create-new-post",
  [
    validateSection(),
    validateNameOfThePost(),
    validatePostCode(),
    validateOptStr("api_key_from_user"),
    validateOptStr("version"),
  ],
  createNewPost
);

router.delete(
  "/delete-posts",
  [validatePostIdOrCode("post_id"), validateSection("section", true)],
  deletePost
);

export default router;
