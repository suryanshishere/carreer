import express from "express";
import checkAuth from "../../middleware/check-auth";
import authRoutes from "./auth/auth-routes";
// import verifyCheckAuthRoutes from "./auth/verify-check-routes";
// import accountExamsRoutes from "./account/account-exams-routes";
// import settingRoutes from "./account/setting-routes";
import createPostRoutes from "./account/create-post-routes";

const router = express.Router();

router.use("/auth", authRoutes);

// router.use("/auth", verifyCheckAuthRoutes);

router.use("/account", createPostRoutes); //rn, using before checkauth middleware but after testing shift it below

router.use(checkAuth);

// router.use("/", settingRoutes);

// router.use("/", accountExamsRoutes);

export default router;
