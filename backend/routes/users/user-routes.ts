import express from "express";
import authRoutes from "./auth/auth-routes";
import accountRoutes from "./account/account-routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);

export default router;
