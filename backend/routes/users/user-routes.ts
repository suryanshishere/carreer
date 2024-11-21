import express from "express";
import checkAuth from "../../middleware/check-auth";
import authRoutes from "./auth/auth-routes";
import accountPosts from "./account/account-posts-routes";

const router = express.Router();

router.use("/auth", authRoutes);

// router.use("/auth", verifyCheckAuthRoutes);

router.use(checkAuth);
router.use("/account", accountPosts); //rn, using before checkauth middleware but after testing shift it below


// router.use("/", settingRoutes);

// router.use("/", accountExamsRoutes);

export default router;
