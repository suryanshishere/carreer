import express from "express";
import authRoutes from "./auth/auth-routes";
import accountRoutes from "./account/account-routes";
import publisherRoutes from "./publisherRoutes/publisher-routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/publisher", publisherRoutes);
router.use("/account", accountRoutes);

export default router;
