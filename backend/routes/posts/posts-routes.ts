import express from "express";
import { home, postDetail, section } from "@controllers/posts/posts-controllers";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", section);
router.get('/sections/:section/:postId', postDetail);


export default router;
