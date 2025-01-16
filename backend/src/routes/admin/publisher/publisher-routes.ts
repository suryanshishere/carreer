import { createNewPost } from "@controllers/admin/publisher/publisher-controllers";
import { createNewPostValidators } from "@routes/validation-routes-utils";
import express from "express"; 

const router = express.Router();
router.post("/create-new-post", createNewPostValidators, createNewPost);

export default router;
