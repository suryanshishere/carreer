import express from "express";
import { home, sectionDetail, section } from "@controllers/posts/posts-controllers";

const router = express.Router();

router.get(["/", "/home"], home);
router.get("/sections/:section", section);
router.get('/sections/:section/:postId', sectionDetail);


export default router;
