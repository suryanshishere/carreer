import express from "express";
const router = express.Router();
import postRoutes from "./account-posts-routes";
import settingRoutes from "./account-posts-routes";

router.use("/posts", postRoutes);
router.use("/setting", settingRoutes);

export default router;
