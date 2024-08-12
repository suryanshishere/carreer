import express from "express";
import adminPublicRoutes from "./adminPublic/admin-public-routes";

const router = express.Router();

router.use("/public", adminPublicRoutes);

export default router;
