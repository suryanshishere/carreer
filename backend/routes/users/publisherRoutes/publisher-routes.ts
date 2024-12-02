import { createNewPost } from "@controllers/users/publisherControllers/publisher-controllers";
import express from "express";
import { createNewPostValidators } from "./publisher-routes-utils";

const router = express.Router();
router.post("/create-new-post", createNewPostValidators, createNewPost);

export default router;
