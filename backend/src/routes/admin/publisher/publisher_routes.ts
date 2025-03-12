import {
  createNewPost,
  deletePost,
} from "@controllers/admin/publisher/publisher-controllers";
import {
  validateOptStr,
  validateNameOfThePost,
  validatePostCodeOrVersion,
  validateSection,
  validatePostIdOrCode,
} from "@routes/utils";
import express from "express";

const router = express.Router();
router.post(
  "/create-new-post",
  [
    validateSection(),
    validateNameOfThePost(),
    validatePostCodeOrVersion(),
    validateOptStr("api_key_from_user"),
    validatePostCodeOrVersion("version", true),
  ],
  createNewPost
);

router.delete(
  "/delete-posts",
  [validatePostIdOrCode("post_id"), validateSection("section", true)],
  deletePost
);

export default router;
