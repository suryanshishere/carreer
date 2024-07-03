import express from "express";
import { adminExamData } from "../../../controllers/admin/admin-public-controllers";

const router = express.Router();

router.get("/admin_exam_data", adminExamData);

export default router;
