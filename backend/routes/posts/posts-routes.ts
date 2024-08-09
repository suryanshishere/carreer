import express from "express";
import { getPostHomeList, getPostDetail, getPostCategoryList } from "@controllers/posts/posts-controllers";

const router = express.Router();

router.get("/", getPostHomeList);
router.get("/home", getPostHomeList);
router.get("/category/:category", getPostCategoryList);
router.get('/category/:category/:postId', getPostDetail);


export default router;
