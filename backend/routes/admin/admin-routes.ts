import express from "express";
import adminPublicRoutes from "./public/admin-public-routes";

const router = express.Router();

router.use("/public", adminPublicRoutes);

export default router;
