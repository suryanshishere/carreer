import express from "express";
import adminPublicRoutes from "./adminPublic/admin-public-routes";
import adminPrivateRoutes from "./adminPrivate/admin-private-routes";

const router = express.Router();

router.use("/public", adminPublicRoutes);
router.use("/private", adminPrivateRoutes);

export default router;
