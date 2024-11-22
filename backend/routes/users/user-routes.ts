import express from "express";
import checkAuth from "../../middleware/check-auth";
import authRoutes from "./auth/auth-routes";
import accountRoutes from "./account/account-routes";

const router = express.Router();


router.use("/auth", authRoutes);
router.use(checkAuth);
router.use("/account", accountRoutes);

// router.use("/", accountExamsRoutes);

export default router;
