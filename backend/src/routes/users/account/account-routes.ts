import express from "express";
const router = express.Router();
import postRoutes from "./account-posts-routes";
import settingRoutes from "./setting-routes";

router.use("/post", postRoutes);
router.use("/setting", settingRoutes);

export default router;
