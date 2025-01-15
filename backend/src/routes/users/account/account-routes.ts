import express from "express";
const router = express.Router();
import postRoutes from "./account-posts-routes";
import settingRoutes from "./account-setting-routes";
import modeRoutes from "./account-mode-routes"; 

router.use("/mode", modeRoutes);
router.use("/post", postRoutes);
router.use("/setting", settingRoutes);

export default router;
